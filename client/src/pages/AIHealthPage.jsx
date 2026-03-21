import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, Activity, FileText, Utensils, Search, Brain,
    ShieldCheck, Heart, Plus, Zap, Eye, Pill, Scan, Upload,
    CheckCircle, AlertTriangle, TrendingUp, Clock, Star,
    ChevronRight, Cpu, Microscope, Stethoscope, Dna, ArrowRight
} from 'lucide-react';
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
    const [dragOver, setDragOver] = useState(false);
    const skinInputRef = useRef();

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
        } catch (err) { console.error(err); }
        finally { setIsDietLoading(false); }
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
        } catch (err) { console.error(err); }
        finally { setIsDrugsLoading(false); }
    };

    const analyzeSkin = async (file) => {
        if (!file) return;
        const previewReader = new FileReader();
        previewReader.onloadend = () => setSkinImage(previewReader.result);
        previewReader.readAsDataURL(file);
        setIsSkinLoading(true);
        setSkinResult(null);
        try {
            const { predictSkinCancer } = await import('../utils/api');
            const resp = await predictSkinCancer(file);
            if (resp.data.success) {
                const pred = resp.data;
                setSkinResult({
                    condition: pred.condition,
                    confidence: (pred.confidence * 100).toFixed(1),
                    risk: pred.confidence > 0.8 ? 'High' : pred.confidence > 0.5 ? 'Medium' : 'Low'
                });
            }
        } catch (err) {
            console.error(err);
            setSkinResult({ error: 'Analysis failed. Please try again.' });
        } finally {
            setIsSkinLoading(false);
        }
    };

    const tabs = [
        { id: 'clinical', icon: Stethoscope, label: 'Clinical Triage', color: '#10b981' },
        { id: 'ocr', icon: Scan, label: 'Report Scanner', color: '#3b82f6' },
        { id: 'wellness', icon: Utensils, label: 'Wellness AI', color: '#10b981' },
        { id: 'drugs', icon: Pill, label: 'Medicine AI', color: '#3b82f6' },
        { id: 'derma', icon: Eye, label: 'Dermatology', color: '#10b981' },
    ];

    const riskColors = { High: '#ef4444', Medium: '#f59e0b', Low: '#10b981' };

    return (
        <div className="min-h-screen bg-[#fcfdfe] pt-32 pb-24 px-6 relative overflow-hidden">
            
            {/* Elegant Background Elements */}
            <div className="absolute top-0 right-0 w-[50%] h-[500px] bg-gradient-to-bl from-hospital-primary/5 via-transparent to-transparent pointer-events-none rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-hospital-secondary/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="container mx-auto max-w-7xl relative z-10">
                
                {/* Header with Round AI Banner */}
                <div className="flex flex-col items-center text-center mb-16">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="mb-8 relative">
                        {/* Round AI Banner badge */}
                        <div className="w-20 h-20 bg-white rounded-full p-1.5 shadow-xl border border-hospital-primary/20 flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-hospital-primary/5 group-hover:bg-hospital-primary/10 transition-colors"></div>
                            <div className="relative z-10 text-hospital-primary flex flex-col items-center">
                                <span className="text-[10px] font-black tracking-widest leading-none">AI</span>
                                <Sparkles size={20} className="mt-1 animate-pulse" />
                            </div>
                            {/* Rotating Ring */}
                            <div className="absolute inset-0 border-2 border-dashed border-hospital-primary/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
                        </div>
                    </motion.div>

                    <h1 className="text-4xl lg:text-6xl font-black text-hospital-dark mb-4 leading-tight">
                        Intelligent <span className="text-hospital-primary italic">Health</span> Command
                    </h1>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.3em] max-w-xl">Sri Kamala Hospitals · Professional Clinical AI Services</p>
                </div>

                {/* Navigation Tabs - Modern Professional */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`px-8 py-5 rounded-[24px] font-bold text-sm transition-all flex items-center gap-3 border ${activeTab === tab.id ? 'bg-white text-hospital-dark border-hospital-primary/20 shadow-xl scale-105' : 'bg-transparent text-gray-400 border-gray-100/50 hover:bg-gray-50'}`}>
                            <tab.icon size={18} color={activeTab === tab.id ? tab.color : '#94a3b8'} className={activeTab === tab.id ? "animate-pulse" : ""} />
                            <span className="font-['Outfit']">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content Area - Clean Hospital Architecture */}
                <div className="bg-white rounded-[40px] shadow-2xl shadow-hospital-dark/5 border border-gray-50 p-8 lg:p-16 min-h-[600px] overflow-hidden">
                    <AnimatePresence mode="wait">
                        
                        {/* Clinical Symptom Checker */}
                        {activeTab === 'clinical' && (
                            <motion.div key="clinical" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full">
                                <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-50">
                                    <div className="p-3 bg-hospital-primary/10 rounded-2xl text-hospital-primary"><Stethoscope size={28} /></div>
                                    <div>
                                        <h2 className="text-2xl font-black text-hospital-dark">Clinical Triage Engine</h2>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Autonomous Symptom Parsing v4.0</p>
                                    </div>
                                </div>
                                <AISymptomChecker />
                            </motion.div>
                        )}

                        {/* OCR Scanner */}
                        {activeTab === 'ocr' && (
                            <motion.div key="ocr" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="p-3 bg-hospital-secondary/10 rounded-2xl text-hospital-secondary"><Scan size={28} /></div>
                                            <div>
                                                <h2 className="text-2xl font-black text-hospital-dark">Report Digitization</h2>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-[#3b82f6]">Llama 3.2 90B Vision Protocol</p>
                                            </div>
                                        </div>
                                        
                                        <label className="block w-full min-h-[400px] border-4 border-dashed border-gray-100 rounded-[32px] hover:border-hospital-secondary/30 transition-all bg-gray-50/50 cursor-pointer p-12 text-center group">
                                            {isOcrLoading ? (
                                                <div className="flex flex-col items-center justify-center h-full gap-4">
                                                    <div className="w-16 h-16 border-4 border-hospital-secondary/20 border-t-hospital-secondary rounded-full animate-spin"></div>
                                                    <p className="text-sm font-black text-hospital-secondary uppercase tracking-[0.2em]">Digitizing Report...</p>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full space-y-6">
                                                    <div className="w-20 h-20 bg-white rounded-3xl shadow-lg flex items-center justify-center text-hospital-secondary group-hover:scale-110 transition-transform"><Upload size={32} /></div>
                                                    <div>
                                                        <h4 className="text-xl font-bold text-hospital-dark">Upload Prescription</h4>
                                                        <p className="text-xs text-gray-400 mt-2">Handwritten notes or Lab results (PNG, JPG, PDF)</p>
                                                    </div>
                                                </div>
                                            )}
                                            <input type="file" className="hidden" accept="image/*" onChange={handleOCR} />
                                        </label>
                                    </div>

                                    <div className="bg-hospital-dark rounded-[32px] p-10 text-white shadow-2xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"><FileText size={200} /></div>
                                        <div className="flex items-center gap-3 mb-8">
                                            <div className="w-2 h-2 bg-hospital-secondary rounded-full animate-pulse"></div>
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-hospital-secondary">Extraction Insights</h4>
                                        </div>

                                        {ocrResult ? (
                                            <div className="space-y-8 relative z-10">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                                        <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1">Patient</p>
                                                        <p className="text-sm font-bold">{ocrResult.patient || 'Standard'}</p>
                                                    </div>
                                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                                        <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1">Clinic Date</p>
                                                        <p className="text-sm font-bold">{ocrResult.date || 'Today'}</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <p className="text-[9px] text-white/40 uppercase tracking-widest">Clinical Explanation</p>
                                                    <p className="text-sm leading-relaxed text-white/90 font-['Noto_Sans_Telugu']">{ocrResult.explanation_te || ocrResult.diagnosis_en}</p>
                                                    <p className="text-[11px] text-hospital-secondary font-medium leading-relaxed mt-4 italic">{ocrResult.explanation_en}</p>
                                                </div>

                                                {ocrResult.medicines?.length > 0 && (
                                                    <div>
                                                        <p className="text-[9px] text-white/40 uppercase tracking-widest mb-3">Detected Medications</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {ocrResult.medicines.map((m, i) => <span key={i} className="px-3 py-1.5 bg-hospital-secondary/10 border border-hospital-secondary/20 rounded-lg text-[10px] font-bold text-hospital-secondary">{m}</span>)}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
                                                <Brain size={64} />
                                                <p className="text-xs font-black uppercase tracking-[0.3em] mt-6">Awaiting Input Scan</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Wellness AI - Modern Clean */}
                        {activeTab === 'wellness' && (
                            <motion.div key="wellness" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                    <div className="lg:col-span-1 space-y-8">
                                        <div className="p-4 bg-hospital-primary/5 rounded-3xl border border-hospital-primary/10 flex items-center gap-4">
                                            <div className="p-3 bg-white rounded-2xl shadow-sm text-hospital-primary"><Utensils size={24} /></div>
                                            <h3 className="font-bold text-hospital-dark">Wellness Specialist</h3>
                                        </div>
                                        <p className="text-sm text-gray-500 leading-relaxed font-medium">Generate medical-grade nutrition plans tailored to your specific clinical condition.</p>
                                        
                                        <div className="space-y-4">
                                            {['Diabetes Type 2', 'Hypertension', 'High Protein Diet', 'Pregnancy Nutrition'].map(tag => (
                                                <button key={tag} onClick={() => setDietInput(tag)} className="w-full p-4 text-left text-sm font-bold text-gray-600 bg-gray-50 hover:bg-white hover:shadow-lg hover:border-hospital-primary/30 border border-transparent rounded-2xl transition-all flex items-center justify-between group">
                                                    {tag} <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </button>
                                            ))}
                                            <textarea value={dietInput} onChange={(e) => setDietInput(e.target.value)} placeholder="Enter details manually..."
                                                className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl p-6 min-h-[150px] text-sm font-medium outline-none focus:ring-2 ring-hospital-primary/10" />
                                            <button onClick={generateDietPlan} disabled={isDietLoading}
                                                className="w-full py-5 bg-hospital-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:shadow-hospital-primary/20 transition-all flex items-center justify-center gap-3">
                                                {isDietLoading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <><Sparkles size={16}/> Build Clinical Plan</>}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-2 bg-gray-50 rounded-[40px] p-10 border border-gray-100 flex flex-col min-h-[500px]">
                                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200/50">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 bg-hospital-primary rounded-full"></div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-hospital-primary">Scientific Nutrition Response</span>
                                            </div>
                                            <Heart size={20} className="text-gray-300" />
                                        </div>
                                        <div className="flex-1 overflow-y-auto pr-4 scrollbar-hide">
                                            {dietPlan ? (
                                                <div className="space-y-10">
                                                    {dietPlan.includes('|||') ? (
                                                        <>
                                                            <div className="space-y-4">
                                                                <p className="text-[9px] font-black text-hospital-primary uppercase tracking-[0.2em]">Telugu Clinical Advice</p>
                                                                <p className="text-lg font-['Noto_Sans_Telugu'] font-bold text-hospital-dark leading-relaxed">{dietPlan.split('|||')[0].trim()}</p>
                                                            </div>
                                                            <div className="pt-8 border-t border-gray-200/50">
                                                                <p className="text-[9px] font-black text-hospital-primary uppercase tracking-[0.2em]">English Medical Plan</p>
                                                                <p className="text-sm font-medium text-gray-500 leading-relaxed whitespace-pre-wrap mt-2">{dietPlan.split('|||')[1].trim()}</p>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <p className="text-lg font-bold text-hospital-dark italic">{dietPlan}</p>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="h-full flex flex-col items-center justify-center opacity-10 text-center">
                                                    <Utensils size={80} />
                                                    <p className="text-xs font-black uppercase tracking-[0.4em] mt-4">Waiting for health parameters</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Skin AI - Modern Diagnostic */}
                        {activeTab === 'derma' && (
                            <motion.div key="derma" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                    <div className="space-y-10">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-hospital-primary/10 rounded-2xl text-hospital-primary"><Eye size={28} /></div>
                                            <div>
                                                <h2 className="text-2xl font-black text-hospital-dark">Dermatology Scan</h2>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">CNN Skin Intelligence v4.2</p>
                                            </div>
                                        </div>

                                        <label
                                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                            onDragLeave={() => setDragOver(false)}
                                            onDrop={(e) => { e.preventDefault(); setDragOver(false); analyzeSkin(e.dataTransfer.files[0]); }}
                                            className={`block w-full min-h-[350px] border-4 border-dashed rounded-[40px] cursor-pointer transition-all relative overflow-hidden flex flex-col items-center justify-center text-center p-8 ${dragOver ? 'border-hospital-primary bg-hospital-primary/5 shadow-2xl' : 'border-gray-100 bg-gray-50 hover:border-hospital-primary/20 hover:bg-white hover:shadow-xl'}`}>
                                            {isSkinLoading ? (
                                                <div className="flex flex-col items-center gap-6">
                                                    <div className="w-16 h-16 border-4 border-hospital-primary/10 border-t-hospital-primary rounded-full animate-spin"></div>
                                                    <p className="text-sm font-black text-hospital-primary uppercase tracking-[0.2em]">Analyzing lesion pattern...</p>
                                                </div>
                                            ) : skinImage ? (
                                                <div className="relative w-full h-full flex items-center justify-center">
                                                    <img src={skinImage} className="max-h-[300px] rounded-3xl object-contain shadow-2xl border-4 border-white" alt="skin" />
                                                    <div className="absolute inset-0 bg-hospital-primary/10 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <span className="bg-white px-6 py-2 rounded-full text-[10px] font-black uppercase text-hospital-primary shadow-xl">Update Photo</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-6 flex flex-col items-center">
                                                    <div className="w-20 h-20 bg-white rounded-[30px] shadow-lg flex items-center justify-center text-hospital-primary"><Microscope size={36} /></div>
                                                    <div>
                                                        <h4 className="text-xl font-bold text-hospital-dark">Drop Skin Photo</h4>
                                                        <p className="text-xs text-gray-400 mt-2">Visual analysis of rashes, moles, or lesions</p>
                                                    </div>
                                                </div>
                                            )}
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => analyzeSkin(e.target.files[0])} />
                                        </label>
                                    </div>

                                    <div className="flex flex-col">
                                        <div className="bg-hospital-dark rounded-[40px] p-10 text-white min-h-[450px] flex flex-col justify-center relative overflow-hidden group shadow-2xl">
                                             <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity"><Dna size={300} /></div>
                                             
                                             <div className="flex items-center gap-3 mb-10 relative z-10">
                                                <div className="w-6 h-6 bg-hospital-primary/20 rounded-lg flex items-center justify-center"><Activity size={14} color="#10b981" /></div>
                                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-hospital-primary">Diagnostic Risk Assessment</span>
                                             </div>

                                             {skinResult ? (
                                                 <div className="space-y-8 relative z-10">
                                                     <div className="space-y-2">
                                                         <p className="text-[10px] uppercase tracking-widest text-white/30">Detected Condition</p>
                                                         <h4 className="text-4xl font-black">{skinResult.condition}</h4>
                                                         <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mt-4`} style={{ backgroundColor: `${riskColors[skinResult.risk]}20`, color: riskColors[skinResult.risk] }}>
                                                             <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: riskColors[skinResult.risk] }}></div>
                                                             {skinResult.risk} Level Risk Identified
                                                         </div>
                                                     </div>

                                                     <div className="space-y-4 bg-white/5 p-6 rounded-3xl border border-white/10">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-[10px] font-bold text-white/40 uppercase">AI Pattern Confidence</span>
                                                            <span className="text-sm font-black text-hospital-primary">{skinResult.confidence}%</span>
                                                        </div>
                                                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                                            <motion.div initial={{ width: 0 }} animate={{ width: `${skinResult.confidence}%` }} transition={{ duration: 1.2 }}
                                                                className="h-full bg-hospital-primary rounded-full shadow-[0_0_10px_#10b981]" />
                                                        </div>
                                                     </div>

                                                     <div className="p-5 border-l-4 border-hospital-primary bg-hospital-primary/5 rounded-r-2xl">
                                                         <p className="text-xs text-white/80 leading-relaxed italic uppercase font-bold tracking-tight">Clinical Note: Results are experimental and part of clinical research AI program. Consult a doctor immediately.</p>
                                                     </div>
                                                 </div>
                                             ) : (
                                                 <div className="flex flex-col items-center justify-center h-full opacity-10 gap-6">
                                                     <Eye size={80} />
                                                     <p className="text-xs font-black uppercase tracking-[0.4em]">Visual pattern parsing engine offline</p>
                                                 </div>
                                             )}
                                        </div>
                                        
                                        {/* Emergency Trigger */}
                                        <div className="mt-6 p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm"><AlertTriangle size={16} className="text-red-500" /></div>
                                                <p className="text-[10px] font-bold text-red-600 uppercase">Immediate Emergency Concern?</p>
                                            </div>
                                            <a href="tel:9154404051" className="text-xs font-black text-red-600 bg-white px-4 py-2 rounded-xl shadow-sm hover:bg-red-500 hover:text-white transition-all">CALL NOW</a>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Drugs / Medicine AI */}
                        {activeTab === 'drugs' && (
                            <motion.div key="drugs" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="p-3 bg-hospital-secondary/10 rounded-2xl text-hospital-secondary"><Pill size={28} /></div>
                                            <div>
                                                <h2 className="text-2xl font-black text-hospital-dark">Medicine Compatibility</h2>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-[#3b82f6]">Dynamic Pharmacological Checker</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 leading-relaxed font-medium mb-8">Analyze drug interactions, side effects, and safe dosage patterns across your medications.</p>
                                        
                                        <div className="space-y-6">
                                            <div className="flex flex-wrap gap-2">
                                                {['Aspirin', 'Metformin', 'Ibuprofen', 'Paracetamol'].map(m => (
                                                    <button key={m} onClick={() => setDrugsInput(p => p ? `${p}, ${m}` : m)}
                                                        className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-600 hover:border-hospital-secondary/30 transition-all flex items-center gap-2">
                                                        <Plus size={12} className="text-hospital-secondary" /> {m}
                                                    </button>
                                                ))}
                                            </div>
                                            <textarea value={drugsInput} onChange={(e) => setDrugsInput(e.target.value)} placeholder="Type drug names separated by commas..."
                                                className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl p-6 min-h-[120px] text-sm font-medium outline-none" />
                                            <button onClick={checkDrugInteractions} disabled={isDrugsLoading}
                                                className="w-full py-5 bg-hospital-secondary text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:shadow-hospital-secondary/20 transition-all flex items-center justify-center gap-3">
                                                {isDrugsLoading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <><ShieldCheck size={16}/> Cross-Verify Safety</>}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-hospital-dark rounded-[40px] p-10 text-white shadow-2xl min-h-[400px]">
                                        <div className="flex items-center gap-3 mb-8">
                                            <div className="w-2 h-2 bg-hospital-secondary rounded-full animate-pulse"></div>
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-hospital-secondary">Pharmacology AI Report</h4>
                                        </div>
                                        {drugsResult ? (
                                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                                                {drugsResult.includes('|||') ? (
                                                    <>
                                                        <div className="space-y-4">
                                                            <p className="text-[10px] text-white/40 uppercase tracking-widest">Telugu Summary</p>
                                                            <p className="text-base font-['Noto_Sans_Telugu'] font-bold text-white/90 leading-relaxed">{drugsResult.split('|||')[0].trim()}</p>
                                                        </div>
                                                        <div className="pt-8 border-t border-white/10 space-y-4">
                                                            <p className="text-[10px] text-white/40 uppercase tracking-widest">English Safety Profile</p>
                                                            <p className="text-sm font-medium text-hospital-secondary leading-relaxed italic">{drugsResult.split('|||')[1].trim()}</p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <p className="text-lg font-bold text-white/80">{drugsResult}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center opacity-10 py-16">
                                                <Pill size={80} />
                                                <p className="text-xs font-black uppercase tracking-[0.3em] mt-6">Safety logic idle</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>

                {/* Bottom Trust Badge */}
                <div className="mt-20 flex justify-center">
                    <div className="px-8 py-4 bg-white rounded-full border border-gray-100 flex items-center gap-4 shadow-sm">
                        <ShieldCheck size={20} className="text-hospital-primary" />
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Powered by NVIDIA Medical AI & Meta Llama 3.2 90B Protocol</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AIHealthPage;
