import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Activity, FileText, Utensils, Search, ArrowRight, Microscope, Brain, ShieldCheck, Heart, Plus } from 'lucide-react';
import AISymptomChecker from '../components/AISymptomChecker';
import { chatWithAI, analyzeVisionImage, analyzeOCR } from '../utils/api';

const AIHealthPage = () => {
    const [activeTab, setActiveTab] = useState('clinical');
    const [ocrResult, setOcrResult] = useState(null);
    const [isOcrLoading, setIsOcrLoading] = useState(false);
    const [dietInput, setDietInput] = useState('');
    const [dietPlan, setDietPlan] = useState(null);
    const [isDietLoading, setIsDietLoading] = useState(false);

    const [drugsInput, setDrugsInput] = useState('');
    const [drugsResult, setDrugsResult] = useState(null);
    const [isDrugsLoading, setIsDrugsLoading] = useState(false);

    const [skinImage, setSkinImage] = useState(null);
    const [skinResult, setSkinResult] = useState(null);
    const [isSkinLoading, setIsSkinLoading] = useState(false);

    const handleOCR = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsOcrLoading(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                const resp = await analyzeOCR(reader.result);
                setOcrResult(resp.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsOcrLoading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const generateDietPlan = async () => {
        if (!dietInput) return;
        setIsDietLoading(true);
        try {
            const resp = await chatWithAI(`Generate a clinical diet plan for: ${dietInput}. Include Breakfast, Lunch, Dinner, and clinical precautions. Format as professional points.
CRITICAL RULE: You MUST format your precise response as: 
[Telugu Translation of diet plan]
|||
[English Translation of diet plan]`);
            setDietPlan(resp.data.response);
        } catch (err) {
            console.error(err);
        } finally {
            setIsDietLoading(false);
        }
    };

    const checkDrugInteractions = async () => {
        if (!drugsInput) return;
        setIsDrugsLoading(true);
        try {
            const resp = await chatWithAI(`Medical Analysis: Evaluate the drug interactions for: [${drugsInput}]. Detail major side effects, contraindications, and safety profile in 3 bullet points.
CRITICAL RULE: You MUST format your precise response as: 
[Telugu Translation]
|||
[English Translation]`);
            setDrugsResult(resp.data.response);
        } catch (err) {
            console.error(err);
        } finally {
            setIsDrugsLoading(false);
        }
    };

    const analyzeSkin = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = async () => {
            setSkinImage(reader.result);
            setIsSkinLoading(true);
            try {
                const { analyzeVisionImage } = await import('../utils/api');
                const resp = await analyzeVisionImage(reader.result, "Analyze this clinical dermatological image. Be highly concise. Give suspected type of lesion/rash and precaution.");
                if(resp.data.success && resp.data.analysis) {
                    const ai = resp.data.analysis;
                    setSkinResult(`Condition: ${ai.condition.te}\n${ai.precautions.map(p=>p.te).join(', ')}\n|||\nCondition: ${ai.condition.en}\n${ai.precautions.map(p=>p.en).join(', ')}`);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsSkinLoading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const tabs = [
        { id: 'clinical', icon: <Brain size={20} />, label: 'Clinical Triage', en: 'Vision & Symptoms' },
        { id: 'ocr', icon: <FileText size={20} />, label: 'Report Scanner', en: 'AI OCR Extraction' },
        { id: 'wellness', icon: <Utensils size={20} />, label: 'Wellness AI', en: 'Diet & Nutrition' },
        { id: 'drugs', icon: <ShieldCheck size={20} />, label: 'Medicine AI', en: 'Drug Interactions' },
        { id: 'derma', icon: <Search size={20} />, label: 'Dermatology', en: 'Skin AI Scan' }
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] pt-32 pb-24 px-6 overflow-hidden relative">
            {/* Background Aesthetics */}
            <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-hospital-primary/5 rounded-bl-[400px] pointer-events-none z-0"></div>
            <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-hospital-secondary/5 rounded-tr-[400px] pointer-events-none z-0"></div>

            <div className="container mx-auto max-w-7xl relative z-10">
                {/* Dynamic Header */}
                <div className="text-center mb-16 space-y-4">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-hospital-primary/10 rounded-full text-hospital-primary mb-4">
                        <Sparkles size={14} className="animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Multimodal Clinical AI v3.2</span>
                    </motion.div>
                    <h1 className="text-5xl lg:text-7xl font-black text-hospital-dark font-['Noto_Sans_Telugu'] leading-none">
                        AI <span className="text-hospital-secondary italic underline decoration-hospital-secondary/20 underline-offset-[10px]">ఆరోగ్య</span> కేంద్రం.
                    </h1>
                    <p className="text-sm font-bold text-gray-400 max-w-2xl mx-auto uppercase tracking-widest">Sri Kamala Hospitals Central AI Command Dashboard</p>
                </div>

                {/* Tab Navigation */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`px-8 py-5 rounded-[32px] font-black text-xs uppercase tracking-widest transition-all flex items-center gap-4 shadow-sm border-2 ${activeTab === tab.id ? 'bg-hospital-dark text-white border-hospital-dark shadow-2xl scale-105' : 'bg-white text-gray-400 border-white hover:border-hospital-primary/20'}`}>
                            <div className={`${activeTab === tab.id ? 'text-hospital-primary' : 'text-gray-300'} transition-colors`}>{tab.icon}</div>
                            <div className="text-left">
                                <p className="leading-none mb-1 font-['Noto_Sans_Telugu'] text-sm">{tab.label}</p>
                                <p className="text-[8px] opacity-40">{tab.en}</p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Main Action Area */}
                <AnimatePresence mode="wait">
                    {activeTab === 'clinical' && (
                        <motion.div key="clinical" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
                            <AISymptomChecker />
                        </motion.div>
                    )}

                    {activeTab === 'ocr' && (
                        <motion.div key="ocr" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
                            className="bg-white rounded-[60px] shadow-sm border border-gray-100 p-12 lg:p-20 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-12 text-hospital-secondary opacity-5 pointer-events-none"><FileText size={300} /></div>
                            <div className="max-w-3xl relative z-10">
                                <h2 className="text-4xl font-black text-hospital-dark mb-4">Prescription Decoder</h2>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-hospital-secondary mb-12">Digitize Handwriting & Medical Reports</p>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                    <div className="space-y-8">
                                        <label className="block w-full h-80 rounded-[40px] border-4 border-dashed border-gray-100 hover:border-hospital-primary cursor-pointer transition-all bg-gray-50 flex flex-col items-center justify-center text-center p-8 group relative overflow-hidden">
                                            {isOcrLoading ? (
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="w-12 h-12 border-4 border-hospital-primary/20 border-t-hospital-primary rounded-full animate-spin"></div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">OCR Vectorizing...</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-hospital-primary mb-6 group-hover:scale-110 transition-transform"><Plus size={32} /></div>
                                                    <h4 className="font-black text-xl text-hospital-dark mb-2">Upload Report</h4>
                                                    <p className="text-xs font-medium text-gray-400">PDF or Images up to 10MB</p>
                                                </>
                                            )}
                                            <input type="file" className="hidden" accept="image/*" onChange={handleOCR} />
                                        </label>
                                    </div>
                                    <div className="bg-hospital-dark rounded-[40px] p-8 text-white min-h-[20rem] shadow-4xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 text-white/5"><Sparkles size={100} /></div>
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-hospital-primary mb-4">Extracted Insights</h4>
                                        {ocrResult ? (
                                            <div className="space-y-6">
                                                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/10">
                                                    <div>
                                                        <p className="text-[8px] uppercase tracking-widest text-white/40 mb-1">పేషెంట్ (PATIENT)</p>
                                                        <p className="text-sm font-black text-white">{ocrResult.patient || 'Generic'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[8px] uppercase tracking-widest text-white/40 mb-1">తేదీ (DATE)</p>
                                                        <p className="text-sm font-black text-white">{ocrResult.date || 'Today'}</p>
                                                    </div>
                                                </div>
                                                
                                                {/* Test Results Table */}
                                                {ocrResult.test_results && ocrResult.test_results.length > 0 && (
                                                    <div className="overflow-x-auto">
                                                        <table className="w-full text-left text-[10px]">
                                                            <thead>
                                                                <tr className="border-b border-white/5 text-white/40 uppercase tracking-widest">
                                                                    <th className="py-2">పరీక్ష (TEST)</th>
                                                                    <th className="py-2">ఫలితం (VALUE)</th>
                                                                    <th className="py-2">సాధారణ పరిధి (RANGE)</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="text-white/80">
                                                                {ocrResult.test_results.slice(0, 8).map((t, idx) => (
                                                                    <tr key={idx} className="border-b border-white/5 last:border-0">
                                                                        <td className="py-3 pr-2">
                                                                            <p className="font-['Noto_Sans_Telugu'] font-bold text-hospital-secondary leading-none mb-0.5">{t.item_te || t.item_en}</p>
                                                                            <p className="opacity-40 text-[7px] uppercase tracking-tight">{t.item_en}</p>
                                                                        </td>
                                                                        <td className="py-3 font-black text-white">{t.value}</td>
                                                                        <td className="py-3 opacity-50">{t.range}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}

                                                <div className="pt-4 border-t border-white/10 space-y-4">
                                                    <div>
                                                        <p className="text-[8px] uppercase tracking-widest text-white/40 mb-2">వైద్య వివరణ (MEDICAL EXPLANATION)</p>
                                                        <p className="text-sm font-['Noto_Sans_Telugu'] font-medium leading-relaxed text-white/90">{ocrResult.explanation_te || ocrResult.diagnosis || ocrResult.raw_extraction}</p>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-hospital-secondary opacity-80 mt-2">{ocrResult.explanation_en}</p>
                                                    </div>
                                                    
                                                    {ocrResult.medicines && ocrResult.medicines.length > 0 && (
                                                        <div>
                                                            <p className="text-[8px] uppercase tracking-widest text-white/40 mb-2">గుర్తించిన మందులు (DETECTED MEDICINES)</p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {ocrResult.medicines.map((m, i) => <span key={i} className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-bold text-hospital-secondary">{m}</span>)}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center h-full opacity-20">
                                                <p className="text-xs font-black uppercase tracking-widest">Waiting for Data Input</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'wellness' && (
                        <motion.div key="wellness" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
                            className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1 bg-white rounded-[50px] shadow-sm border border-gray-100 p-12">
                                <Utensils size={40} className="text-hospital-secondary mb-8" />
                                <h3 className="text-2xl font-black mb-4">Dietary AI Specialist</h3>
                                <p className="text-sm font-medium text-gray-400 mb-8 leading-relaxed italic">Input your symptoms, condition, or goals to generate a medical diet plan.</p>
                                <div className="space-y-6">
                                    <textarea value={dietInput} onChange={(e) => setDietInput(e.target.value)} placeholder="e.g. Type 2 Diabetes, High Blood Pressure, or Muscle Gain..."
                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-hospital-primary/20 rounded-3xl p-6 min-h-[12rem] text-sm font-bold outline-none transition-all placeholder:text-gray-300" />
                                    <button onClick={generateDietPlan} disabled={isDietLoading}
                                        className="w-full bg-hospital-dark text-white p-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-hospital-primary transition-all disabled:opacity-50">
                                        {isDietLoading ? 'Simulating Nutritionists...' : 'Generate Clinical Plan'}
                                    </button>
                                </div>
                            </div>
                            <div className="lg:col-span-2 bg-hospital-dark rounded-[50px] shadow-4xl p-12 text-white relative overflow-hidden h-[35rem] flex flex-col">
                                <div className="absolute top-0 right-0 p-12 text-white/5 pointer-events-none -mr-20 -mt-20"><ShieldCheck size={400} /></div>
                                <div className="flex items-center justify-between mb-12 relative z-10">
                                    <div>
                                        <h4 className="text-xl font-black">AI Nutritionist Response</h4>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-hospital-primary mt-1">Symptom-Aligned Diet Plan</p>
                                    </div>
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-hospital-secondary"><Heart size={20} /></div>
                                </div>
                                <div className="flex-1 overflow-y-auto pr-6 space-y-6 relative z-10 scrollbar-hide">
                                    {dietPlan ? (
                                        <div className="space-y-4">
                                            {dietPlan.includes('|||') ? (
                                                <>
                                                    <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap text-white/90 font-['Noto_Sans_Telugu']">{dietPlan.split('|||')[0].trim()}</p>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-hospital-secondary opacity-80 mt-4 pt-4 border-t border-white/10 whitespace-pre-wrap">{dietPlan.split('|||')[1].trim()}</p>
                                                </>
                                            ) : (
                                                <p className="text-base font-medium leading-relaxed whitespace-pre-wrap text-white/80 italic">{dietPlan}</p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-20">
                                            <Utensils size={60} />
                                            <p className="text-xs font-black uppercase tracking-widest tracking-[0.4em]">Awaiting Input Parameters</p>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-8 p-6 bg-white/5 rounded-3xl border border-white/10 relative z-10">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-hospital-secondary">Medical Disclaimer</p>
                                    <p className="text-[10px] text-white/40 mt-1">This plan is AI-generated. Clinical oversight is required before starting new dietary regimens.</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'drugs' && (
                        <motion.div key="drugs" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
                            className="bg-white rounded-[60px] shadow-sm border border-gray-100 p-12 lg:p-20 overflow-hidden relative">
                            <h2 className="text-4xl font-black text-hospital-dark mb-4 font-['Noto_Sans_Telugu']">మందుల <span className="text-hospital-secondary italic">సంకర్షణ</span> చెకర్</h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-hospital-secondary mb-12">Drug-Drug Interaction AI Logic</p>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <textarea value={drugsInput} onChange={(e) => setDrugsInput(e.target.value)} placeholder="Enter multiple medicines separated by commas (e.g. Aspirin, Ibuprofen)..."
                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-hospital-primary/20 rounded-3xl p-6 min-h-[12rem] text-sm font-bold outline-none transition-all placeholder:text-gray-300" />
                                    <button onClick={checkDrugInteractions} disabled={isDrugsLoading}
                                        className="w-full bg-hospital-secondary text-white p-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-hospital-primary transition-all disabled:opacity-50">
                                        {isDrugsLoading ? 'Checking Interactions...' : 'Analyze Safety'}
                                    </button>
                                </div>
                                <div className="bg-hospital-dark rounded-[40px] p-8 text-white min-h-[20rem] shadow-4xl relative">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-hospital-primary mb-4">AI Safety Report</h4>
                                    {drugsResult ? (
                                        <div className="space-y-4">
                                            {drugsResult.includes('|||') ? (
                                                <>
                                                    <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap text-white/90 font-['Noto_Sans_Telugu']">{drugsResult.split('|||')[0].trim()}</p>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-hospital-secondary opacity-80 mt-4 pt-4 border-t border-white/10 whitespace-pre-wrap">{drugsResult.split('|||')[1].trim()}</p>
                                                </>
                                            ) : (
                                                <p className="text-sm font-medium leading-relaxed text-white/80">{drugsResult}</p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-full opacity-20 text-xs font-black uppercase tracking-widest">Waiting for Input</div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'derma' && (
                        <motion.div key="derma" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
                            className="bg-white rounded-[60px] shadow-sm border border-gray-100 p-12 lg:p-20 overflow-hidden relative">
                            <h2 className="text-4xl font-black text-hospital-dark mb-4 font-['Noto_Sans_Telugu']">చర్మ వ్యాధి <span className="text-hospital-secondary italic">స్కాన్</span></h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-hospital-secondary mb-12">Upload visual of skin, rash, or lesion</p>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                <label className="block w-full h-80 rounded-[40px] border-4 border-dashed border-gray-100 hover:border-hospital-secondary cursor-pointer transition-all bg-gray-50 flex flex-col items-center justify-center text-center p-8 group relative overflow-hidden">
                                     {isSkinLoading ? (
                                        <div className="w-12 h-12 border-4 border-hospital-secondary/20 border-t-hospital-secondary rounded-full animate-spin"></div>
                                     ) : skinImage ? (
                                        <img src={skinImage} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-30 transition-opacity" />
                                     ) : (
                                        <>
                                            <Search size={32} className="text-hospital-secondary mb-4 group-hover:scale-110 transition-transform"/>
                                            <h4 className="font-black text-xl text-hospital-dark">Skin Scanner</h4>
                                        </>
                                     )}
                                     <input type="file" className="hidden" accept="image/*" onChange={analyzeSkin} />
                                </label>
                                <div className="bg-hospital-dark rounded-[40px] p-8 text-white min-h-[20rem] shadow-4xl relative">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-hospital-primary mb-4">Dermatology Analysis</h4>
                                    {skinResult ? (
                                        <div className="space-y-4">
                                            {skinResult.includes('|||') ? (
                                                <>
                                                    <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap text-white/90 font-['Noto_Sans_Telugu']">{skinResult.split('|||')[0].trim()}</p>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-hospital-secondary opacity-80 mt-4 pt-4 border-t border-white/10 whitespace-pre-wrap">{skinResult.split('|||')[1].trim()}</p>
                                                </>
                                            ) : (
                                                <p className="text-sm font-medium leading-relaxed text-white/80">{skinResult}</p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-full opacity-20 text-xs font-black uppercase tracking-widest">Waiting for Image</div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AIHealthPage;
