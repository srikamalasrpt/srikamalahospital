import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, Activity, FileText, Utensils, Search, Brain,
    ShieldCheck, Heart, Plus, Zap, Eye, Pill, Scan, Upload,
    CheckCircle, AlertTriangle, TrendingUp, Clock, Star,
    ChevronRight, Cpu, Microscope, Stethoscope, Dna, ArrowRight, X, Droplets, Scissors, Syringe
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

    const [bmi, setBmi] = useState({ height: '', weight: '', result: null, aiAdvice: '' });
    const [isBmiLoading, setIsBmiLoading] = useState(false);
    const [healthData, setHealthData] = useState({ age: '', activity: 'Moderate', sleep: '7-8', nutrition: 'Balanced' });
    const [healthScore, setHealthScore] = useState(null);
    const [isScoreLoading, setIsScoreLoading] = useState(false);
    const [heartRisk, setHeartRisk] = useState(null);
    const [isHeartLoading, setIsHeartLoading] = useState(false);

    const handleOCR = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsOcrLoading(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                const resp = await analyzeOCR(reader.result);
                setOcrResult(resp.data.data);
            } catch (err) { console.error(err); }
            finally { setIsOcrLoading(false); }
        };
        reader.readAsDataURL(file);
    };

    const generateDietPlan = async () => {
        if (!dietInput) return;
        setIsDietLoading(true);
        try {
            const resp = await chatWithAI(`Generate clinical diet for: ${dietInput}. Formatted: [Telugu] ||| [English]`);
            setDietPlan(resp.data.response);
        } catch (err) { console.error(err); }
        finally { setIsDietLoading(false); }
    };

    const checkDrugInteractions = async () => {
        if (!drugsInput) return;
        setIsDrugsLoading(true);
        try {
            const resp = await chatWithAI(`Drug interplay for: [${drugsInput}]. Formatted: [Telugu] ||| [English]`);
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
        } catch (err) { console.error(err); }
        finally { setIsSkinLoading(false); }
    };

    const calculateBMI = async () => {
        if (!bmi.height || !bmi.weight) return;
        const h = parseFloat(bmi.height) / 100;
        const w = parseFloat(bmi.weight);
        const val = (w / (h * h)).toFixed(1);
        let cat = val < 18.5 ? 'Underweight' : val < 25 ? 'Normal' : val < 30 ? 'Overweight' : 'Obese';
        setBmi(p => ({ ...p, result: { value: val, category: cat, color: cat === 'Normal' ? '#00cccc' : '#ff3366' } }));
        setIsBmiLoading(true);
        try {
            const resp = await chatWithAI(`Clinical BMI analysis for ${val} (${cat}). Formatted: [Telugu] ||| [English]`);
            setBmi(p => ({ ...p, aiAdvice: resp.data.response }));
        } catch (err) { console.error(err); }
        finally { setIsBmiLoading(false); }
    };

    const calculateHealthScore = async () => {
        setIsScoreLoading(true);
        try {
            const prompt = `Health Score for: Age ${healthData.age}, Activity ${healthData.activity}. Format: Score: [No] ||| [Telugu] ||| [English]`;
            const resp = await chatWithAI(prompt);
            const pts = resp.data.response.split('|||');
            setHealthScore({ score: pts[0].replace('Score:', '').trim(), adviceTe: pts[1], adviceEn: pts[2] });
        } catch (err) { console.error(err); }
        finally { setIsScoreLoading(false); }
    };

    const checkHeartHealth = async () => {
        setIsHeartLoading(true);
        try {
            const resp = await chatWithAI(`Cardiac Risk for: Age ${healthData.age}, BMI ${bmi.result?.value || 'unknown'}. Format: [Telugu] ||| [English]`);
            setHeartRisk(resp.data.response);
        } catch (err) { console.error(err); }
        finally { setIsHeartLoading(false); }
    };

    const tabs = [
        { id: 'clinical', icon: Stethoscope, label: 'Assistant' },
        { id: 'ocr', icon: Scan, label: 'Reports' },
        { id: 'bmi', icon: Activity, label: 'Biometrics' },
        { id: 'cardio', icon: Heart, label: 'Cardiac' },
        { id: 'wellness', icon: Utensils, label: 'Nutrition' },
        { id: 'drugs', icon: Pill, label: 'Pharma' },
        { id: 'score', icon: TrendingUp, label: 'Score' },
        { id: 'derma', icon: Eye, label: 'Dermatology' },
    ];

    return (
        <div className="min-h-screen bg-[#050505] pt-32 pb-24 px-6 relative overflow-hidden">
            
            {/* Background matrices */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-20 overflow-hidden">
                <div className="absolute top-[10%] right-[10%] w-[800px] h-[800px] bg-hospital-primary/10 rounded-full blur-[140px] animate-pulse-soft"></div>
                <div className="absolute bottom-[10%] left-[10%] w-[600px] h-[600px] bg-hospital-secondary/5 rounded-full blur-[120px] animate-pulse-soft" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="container mx-auto max-w-7xl relative z-10">

                {/* Cybernetic Header */}
                <div className="flex flex-col items-center text-center mb-24">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-10 relative">
                        <div className="w-28 h-28 bg-[#0a0a0a] border border-white/10 rounded-[35px] flex items-center justify-center text-hospital-primary shadow-4xl group-hover:rotate-12 transition-transform backdrop-blur-3xl overflow-hidden relative">
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity"></div>
                            <Cpu size={48} className="animate-spin-slow relative z-10" />
                            <div className="absolute -top-3 -right-3 w-10 h-10 bg-hospital-secondary text-white rounded-2xl flex items-center justify-center shadow-neon-secondary animate-pulse">
                               <Sparkles size={20} />
                            </div>
                        </div>
                    </motion.div>

                    <h1 className="text-6xl lg:text-9xl font-black text-white mb-6 leading-none tracking-tighter italic">
                       AI CLINICAL <span className="text-hospital-secondary">CORE</span>
                    </h1>
                    <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.8em] italic">Authorized Sri Kamala Autonomous Diagnostics v4.0.2</p>
                </div>

                {/* Tactical Navigation Sidebar-style for desktop, grid for mobile */}
                <div className="flex flex-wrap justify-center gap-4 mb-20">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`px-8 py-5 rounded-[30px] font-black text-[11px] uppercase tracking-[0.4em] transition-all flex items-center gap-4 border h-16 active:scale-95 italic ${activeTab === tab.id ? 'bg-white text-black border-white shadow-4xl' : 'bg-white/5 backdrop-blur-3xl text-gray-400 border-white/5 hover:border-white/20 hover:text-white'}`}>
                            <tab.icon size={20} className={activeTab === tab.id ? "text-hospital-secondary" : ""} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Processing Terminal */}
                <div className="bg-[#0a0a0a] border border-white/10 rounded-[60px] min-h-[750px] shadow-4xl relative overflow-hidden group backdrop-blur-3xl">
                    <div className="absolute top-0 left-0 w-full h-14 bg-white/5 border-b border-white/5 flex items-center justify-between px-10">
                        <div className="flex gap-2">
                             {[1,2,3].map(i => <div key={i} className={`w-2 h-2 rounded-full ${i===1?'bg-hospital-primary':i===2?'bg-hospital-secondary':'bg-gray-800'}`}></div>)}
                        </div>
                        <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] italic">Accessing Node: {activeTab.toUpperCase()} // Clinical Protocol Enabled</p>
                    </div>

                    <div className="p-10 lg:p-20 pt-24 h-full">
                        <AnimatePresence mode="wait">
                            {activeTab === 'clinical' && (
                                <motion.div key="clinical" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                    <div className="max-w-4xl mx-auto space-y-16">
                                        <div className="flex items-center gap-8 justify-center lg:justify-start">
                                           <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-hospital-secondary shadow-4xl"><Activity size={32} /></div>
                                           <div>
                                               <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase">Symptom Diagnostic Hub</h2>
                                               <p className="text-[10px] font-black text-hospital-primary uppercase tracking-[0.4em] mt-2 italic">Neural Logic Matrix Synchronization Active</p>
                                           </div>
                                        </div>
                                        <AISymptomChecker />
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'ocr' && (
                                <motion.div key="ocr" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                                    <div className="space-y-10">
                                        <h2 className="text-5xl font-black tracking-tighter text-white uppercase italic">Report Parsing</h2>
                                        <p className="text-sm text-gray-500 italic leading-relaxed font-serif">"Upload clinical documentation for molecular de-coding. Our neural nodes explain prescriptions and lab results with 94.2% institutional accuracy."</p>
                                        <label className="block w-full h-[450px] border border-white/10 border-dashed rounded-[50px] bg-white/5 hover:bg-white/10 transition-all cursor-pointer relative overflow-hidden group/scan">
                                            {isOcrLoading ? (
                                                <div className="flex flex-col items-center justify-center h-full gap-8">
                                                    <div className="w-24 h-24 border-4 border-hospital-primary/20 border-t-hospital-primary rounded-full animate-spin"></div>
                                                    <p className="text-[10px] font-black text-white uppercase tracking-[0.5em] animate-pulse">De-coding Case File...</p>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full space-y-8">
                                                    <div className="w-28 h-28 rounded-[35px] bg-white/5 border border-white/10 flex items-center justify-center text-hospital-secondary group-hover/scan:scale-110 transition-transform shadow-4xl"><Scan size={48} /></div>
                                                    <div className="text-center px-12">
                                                        <h4 className="text-2xl font-black text-white italic">Drop Document Node</h4>
                                                        <p className="text-[10px] text-gray-600 mt-4 font-black uppercase tracking-[0.3em] italic">Standard medical formats: JPG, PNG, PDF</p>
                                                    </div>
                                                </div>
                                            )}
                                            <input type="file" className="hidden" accept="image/*" onChange={handleOCR} />
                                        </label>
                                    </div>

                                    <div className="bg-[#050505] rounded-[50px] p-12 border border-white/10 shadow-4xl flex flex-col min-h-[500px] relative overflow-hidden">
                                        <div className="flex items-center gap-4 mb-12">
                                            <div className="w-2 h-2 bg-hospital-secondary rounded-full animate-ping shadow-neon-secondary"></div>
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 italic">AI Output Stream // Log 0x4F2</h4>
                                        </div>
                                        {ocrResult ? (
                                            <div className="space-y-10">
                                                <div className="grid grid-cols-2 gap-8">
                                                    {[{l:'DATE',v:ocrResult.date},{l:'PATIENT',v:ocrResult.patient}].map((d,i)=>(
                                                        <div key={i} className="p-8 bg-white/5 rounded-3xl border border-white/5 italic">
                                                            <p className="text-[9px] text-gray-600 uppercase tracking-widest mb-3 font-black">{d.l}</p>
                                                            <p className="text-lg font-black text-white">{d.v || 'DETECTED'}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="space-y-8">
                                                    <div>
                                                        <p className="text-[10px] text-hospital-primary uppercase tracking-widest mb-6 font-black italic">CLINICAL EXPLANATION [TELUGU]</p>
                                                        <p className="text-2xl font-black leading-tight font-['Noto_Sans_Telugu'] text-white italic">{ocrResult.explanation_te}</p>
                                                    </div>
                                                    <div className="pt-10 border-t border-white/5">
                                                        <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-6 font-black italic">SCIENTIFIC BREAKDOWN [ENGLISH]</p>
                                                        <p className="text-base font-bold text-white/40 leading-relaxed italic font-serif">"{ocrResult.explanation_en}"</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex-1 flex flex-col items-center justify-center opacity-[0.05]">
                                                <Brain size={150} strokeWidth={1} />
                                                <p className="text-[11px] font-black uppercase tracking-[0.8em] mt-12 text-center text-white italic">Neural sensors offline<br/>Awaiting visual input</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'bmi' && (
                                <motion.div key="bmi" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                                    <div className="space-y-16">
                                        <div>
                                            <h2 className="text-5xl font-black mb-6 tracking-tighter text-white italic uppercase">Biometric Unit</h2>
                                            <p className="text-sm text-gray-500 font-medium italic font-serif leading-relaxed">"Metabolic de-coding suite. Physical metrics are processed through our clinical activity matrix to formulate a precision health roadmap."</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-10">
                                            {[{l:'Height (cm)',p:'175',v:bmi.height,k:'height'},{l:'Weight (kg)',p:'70',v:bmi.weight,k:'weight'}].map(f=>(
                                                <div key={f.k} className="space-y-5">
                                                    <label className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-500 ml-4 italic">{f.l}</label>
                                                    <input value={f.v} onChange={e => setBmi(p => ({ ...p, [f.k]: e.target.value }))} type="number" placeholder={f.p}
                                                        className="w-full bg-white/5 border border-white/10 p-8 rounded-[40px] text-3xl font-black outline-none focus:border-hospital-primary transition-all text-center text-white placeholder:text-gray-800" />
                                                </div>
                                            ))}
                                        </div>
                                        <button onClick={calculateBMI} disabled={isBmiLoading}
                                            className="w-full py-8 bg-white text-black rounded-[40px] font-black text-xs uppercase tracking-[0.6em] shadow-4xl hover:bg-hospital-primary transition-all flex items-center justify-center gap-5 active:scale-95">
                                            {isBmiLoading ? <div className="w-8 h-8 border-4 border-black/20 border-t-black rounded-full animate-spin"></div> : <><Zap size={24} /> Initiate Profile Calc</>}
                                        </button>
                                        {bmi.result && (
                                            <div className="p-12 bg-[#050505] rounded-[55px] border border-white/10 relative overflow-hidden text-center shadow-4xl">
                                                <div className="absolute top-0 left-0 w-full h-1.5" style={{ backgroundColor: bmi.result.color }}></div>
                                                <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.6em] mb-10 italic">Core Metabolic Index Detected</p>
                                                <h3 className="text-9xl font-black tracking-tighter glow-text mb-4" style={{ color: bmi.result.color }}>{bmi.result.value}</h3>
                                                <span className="px-8 py-2 bg-white/5 border border-white/10 rounded-full text-[11px] font-black uppercase text-white tracking-[0.4em] italic">{bmi.result.category}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="bg-white/5 rounded-[60px] p-12 border border-white/10 shadow-4xl flex flex-col min-h-[550px]">
                                        <div className="flex items-center gap-4 mb-16">
                                            <div className="w-2 h-2 bg-hospital-primary rounded-full animate-pulse shadow-neon-primary"></div>
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20 italic">Clinical Logistics Matrix</h4>
                                        </div>
                                        {bmi.aiAdvice ? (
                                            <div className="space-y-12">
                                                <div>
                                                    <p className="text-[10px] text-hospital-primary uppercase tracking-[0.4em] font-black mb-8 italic">WELLNESS ACTION PLAN [TELUGU]</p>
                                                    <p className="text-2xl font-black leading-tight font-['Noto_Sans_Telugu'] text-white italic">{bmi.aiAdvice.split('|||')[0]}</p>
                                                </div>
                                                <div className="pt-12 border-t border-white/5">
                                                    <p className="text-[10px] text-gray-700 uppercase tracking-[0.4em] font-black mb-8 italic">SCIENTIFIC BREAKDOWN [ENGLISH]</p>
                                                    <p className="text-sm font-medium text-white/40 leading-relaxed italic font-serif opacity-70">"{bmi.aiAdvice.split('|||')[1]}"</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex-1 flex flex-col items-center justify-center opacity-[0.05]">
                                                <Activity size={180} strokeWidth={1} />
                                                <p className="text-[12px] font-black uppercase tracking-[0.8em] mt-16 text-center text-white italic">Biometric core idle<br/>Sync metrics to activate</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'cardio' && (
                                <motion.div key="cardio" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto space-y-16">
                                    <div className="text-center space-y-6">
                                        <h2 className="text-6xl font-black italic uppercase tracking-tighter text-white">Cardiac AI Unit</h2>
                                        <p className="text-lg text-gray-500 font-serif italic max-w-2xl mx-auto">"Autonomous cardiovascular risk stratification. Our neural network analyzes arterial telemetry and biometric health markers for immediate cardiac insight."</p>
                                    </div>
                                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="p-10 bg-white/5 border border-white/10 rounded-[50px] shadow-4xl text-center group">
                                           <div className="w-20 h-20 bg-hospital-secondary shadow-neon-secondary rounded-full flex items-center justify-center text-white mx-auto mb-10 group-hover:scale-110 transition-transform">
                                                <Heart size={40} className="animate-pulse" />
                                           </div>
                                           <h4 className="text-xl font-black text-white italic mb-4">HEART RATE SYNC</h4>
                                           <p className="text-[10px] text-gray-600 uppercase tracking-[0.4em] mb-10 italic">Passive Surveillance Active</p>
                                           <button onClick={checkHeartHealth} disabled={isHeartLoading}
                                                className="w-full py-6 bg-white text-black rounded-[28px] font-black text-[11px] uppercase tracking-[0.5em] hover:bg-hospital-secondary transition-all active:scale-95 italic">
                                                {isHeartLoading ? "Processing Pulse..." : "Assess Cardiac Node"}
                                           </button>
                                        </div>
                                        <div className="bg-[#050505] border border-white/10 rounded-[50px] p-10 flex flex-col justify-center min-h-[350px]">
                                            {heartRisk ? (
                                                <div className="space-y-8">
                                                    <p className="text-2xl font-black font-['Noto_Sans_Telugu'] text-white italic leading-tight">{heartRisk.split('|||')[0]}</p>
                                                    <p className="text-sm font-medium text-white/30 italic font-serif italic">"{heartRisk.split('|||')[1]}"</p>
                                                </div>
                                            ) : (
                                                <div className="text-center opacity-[0.03] space-y-6">
                                                    <Heart size={100} className="mx-auto" />
                                                    <p className="text-[10px] font-black uppercase tracking-[0.8em]">Awaiting Heart Sync</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'wellness' && (
                                <motion.div key="wellness" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                                    <div className="lg:col-span-1 space-y-10">
                                        <h2 className="text-5xl font-black tracking-tighter text-white italic uppercase leading-none">Nutri<br/><span className="text-hospital-secondary">Sync</span></h2>
                                        <p className="text-xs text-gray-500 italic leading-relaxed font-black uppercase tracking-widest">Precision Dietary Architect v5.0</p>
                                        <div className="space-y-4">
                                            {['Clinical Diabetes Plan', 'Cardio Recovery Diet', 'Muscle Synthesis AI'].map(tag => (
                                                <button key={tag} onClick={() => setDietInput(tag)} 
                                                    className="w-full p-6 text-left bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 hover:border-hospital-secondary/30 transition-all flex items-center justify-between group">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-600 group-hover:text-white transition-colors">{tag}</span>
                                                    <ChevronRight size={18} className="text-gray-800 group-hover:text-hospital-secondary" />
                                                </button>
                                            ))}
                                            <textarea value={dietInput} onChange={e => setDietInput(e.target.value)} placeholder="Type health goals (e.g. weight loss, high BP)..."
                                                className="w-full bg-white/5 border border-white/10 p-8 rounded-[40px] text-sm font-black outline-none focus:border-hospital-secondary transition-all text-white placeholder:text-gray-800 italic" />
                                            <button onClick={generateDietPlan} disabled={isDietLoading}
                                                className="w-full py-8 bg-hospital-secondary text-white rounded-[40px] font-black text-xs uppercase tracking-[0.6em] shadow-neon-secondary hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-5 italic">
                                                {isDietLoading ? "Designing Plan..." : "Design Protocol Node"}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-2 bg-[#050505] rounded-[60px] p-12 lg:p-16 border border-white/10 flex flex-col relative overflow-hidden shadow-4xl">
                                        <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-hospital-secondary/5 rounded-full blur-[100px]"></div>
                                        <div className="flex items-center gap-4 mb-14">
                                            <div className="w-2 h-2 bg-hospital-secondary rounded-full animate-ping"></div>
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 italic">Nutritional Intelligence Report</h4>
                                        </div>
                                        {dietPlan ? (
                                            <div className="space-y-12">
                                                <div>
                                                    <p className="text-[10px] text-hospital-secondary uppercase tracking-[0.5em] font-black mb-8 italic">REGIONAL PROTOCOL [TELUGU]</p>
                                                    <p className="text-3xl font-black leading-tight font-['Noto_Sans_Telugu'] text-white italic">{dietPlan.split('|||')[0]}</p>
                                                </div>
                                                <div className="pt-12 border-t border-white/5">
                                                    <p className="text-[10px] text-gray-700 uppercase tracking-[0.5em] font-black mb-8 italic">SCIENTIFIC BREAKDOWN [ENGLISH]</p>
                                                    <p className="text-base font-bold text-white/40 leading-relaxed italic font-serif">"{dietPlan.split('|||')[1]}"</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex-1 flex flex-col items-center justify-center opacity-[0.03]">
                                                <Utensils size={180} strokeWidth={1} />
                                                <p className="text-[14px] font-black uppercase tracking-[1em] mt-16 text-center text-white italic">Awaiting nutrition parameters</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'drugs' && (
                                <motion.div key="drugs" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                                    <div className="space-y-12">
                                        <h2 className="text-5xl font-black tracking-tighter text-white italic uppercase italic leading-none">Pharma <br/>AI Lab</h2>
                                        <p className="text-sm text-gray-500 italic font-serif leading-relaxed">"Verified molecular interaction analysis. Sri Kamala's pharmacology core identifies drug conflicts and optimizes clinical safety using global medical datasets."</p>
                                        <div className="space-y-8">
                                            <div className="flex flex-wrap gap-3">
                                                {['Aspirin', 'Metformin', 'Statins'].map(t=>(
                                                    <button key={t} onClick={()=>setDrugsInput(curr=>curr?`${curr}, ${t}`:t)} className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-hospital-primary hover:bg-white/10 transition-all italic">+ {t}</button>
                                                ))}
                                            </div>
                                            <textarea value={drugsInput} onChange={e=>setDrugsInput(e.target.value)} placeholder="Enter molecular compounds (comma separated)..."
                                                className="w-full bg-white/5 border border-white/10 p-10 rounded-[45px] text-lg font-black outline-none focus:border-hospital-primary transition-all text-white placeholder:text-gray-800 italic h-48" />
                                            <button onClick={checkDrugInteractions} disabled={isDrugsLoading}
                                                className="w-full py-8 bg-white text-black rounded-[40px] font-black text-xs uppercase tracking-[0.6em] shadow-4xl hover:bg-hospital-primary transition-all italic active:scale-95">
                                                {isDrugsLoading ? "Verifying Safety..." : "Cross-Verify Pharma Node"}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="bg-[#050505] rounded-[60px] p-12 border border-white/10 flex flex-col justify-center min-h-[500px] shadow-4xl shadow-inner italic">
                                        {drugsResult ? (
                                            <div className="space-y-12">
                                                <p className="text-2xl font-black font-['Noto_Sans_Telugu'] text-white italic leading-tight">{drugsResult.split('|||')[0]}</p>
                                                <div className="pt-10 border-t border-white/5">
                                                     <p className="text-sm font-medium text-white/30 italic font-serif h-auto transition-all">"{drugsResult.split('|||')[1]}"</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex-1 flex flex-col items-center justify-center opacity-[0.03]">
                                                <Pill size={150} strokeWidth={1} />
                                                <p className="text-[12px] font-black uppercase tracking-[0.8em] mt-16 text-center text-white italic">Pharma core offline</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'score' && (
                                <motion.div key="score" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                                    <div className="space-y-16">
                                        <h2 className="text-6xl font-black italic uppercase tracking-tighter text-white">HEALTH IQ</h2>
                                        <p className="text-sm text-gray-500 font-serif italic max-w-sm">"Autonomous clinical quotient assessment. Our neural net computes a holistic wellness index based on multi-factor biometric telemetry."</p>
                                        <div className="grid grid-cols-2 gap-10">
                                            {[{l:'Patient Age',v:healthData.age,k:'age',t:'number'},{l:'Activity Level',v:healthData.activity,k:'activity',t:'select',o:['Sedentary','Moderate','Athlete']},{l:'Sleep Cycle',v:healthData.sleep,k:'sleep',t:'select',o:['< 5h','7-8h','9h+']},{l:'Diet Index',v:healthData.nutrition,k:'nutrition',t:'select',o:['Standard','Organic','Fast Food']}].map(f=>(
                                                <div key={f.k} className="space-y-4">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-700 ml-4 italic">{f.l}</label>
                                                    {f.t==='select'?(
                                                        <select value={f.v} onChange={e=>setHealthData({...healthData,[f.k]:e.target.value})} className="w-full bg-white/5 border border-white/10 p-6 rounded-3xl text-sm font-black text-white outline-none cursor-pointer appearance-none italic">
                                                            {f.o.map(o=><option key={o} value={o} className="bg-black">{o}</option>)}
                                                        </select>
                                                    ):(
                                                        <input value={f.v} onChange={e=>setHealthData({...healthData,[f.k]:e.target.value})} type={f.t} className="w-full bg-white/5 border border-white/10 p-6 rounded-3xl text-xl font-black text-white outline-none italic placeholder:text-gray-800" placeholder="25" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <button onClick={calculateHealthScore} disabled={isScoreLoading}
                                            className="w-full py-8 bg-white text-black rounded-[40px] font-black text-xs uppercase tracking-[0.6em] shadow-4xl hover:bg-hospital-secondary transition-all active:scale-95 italic">
                                            {isScoreLoading ? "Computing IQ..." : "Generate Clinical Quotient"}
                                        </button>
                                    </div>
                                    <div className="bg-white/5 rounded-[60px] p-20 border border-white/10 shadow-4xl flex flex-col items-center justify-center text-center relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-16 opacity-[0.03] group-hover:rotate-45 transition-transform duration-1000"><Star size={300} strokeWidth={1}/></div>
                                        {healthScore ? (
                                            <div className="relative z-10 space-y-16">
                                                <div className="p-16 rounded-[60px] bg-white/5 border border-white/10 shadow-neon-secondary mx-auto flex flex-col items-center justify-center backdrop-blur-3xl group-hover:scale-105 transition-transform duration-700">
                                                    <span className="text-[14px] font-black uppercase tracking-[0.8em] text-hospital-secondary mb-4 italic">QUOTIENT INDEX</span>
                                                    <span className="text-9xl font-black tracking-tighter glow-text text-white italic">{healthScore.score}</span>
                                                </div>
                                                <div className="max-w-md space-y-10 text-left italic">
                                                    <p className="text-2xl font-black font-['Noto_Sans_Telugu'] text-white leading-tight opacity-90">{healthScore.adviceTe}</p>
                                                    <p className="text-[12px] font-medium text-white/30 font-serif leading-relaxed italic opacity-50">"{healthScore.adviceEn}"</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="opacity-[0.05] space-y-10">
                                                <TrendingUp size={200} strokeWidth={1} />
                                                <p className="text-[14px] font-black uppercase tracking-[1em] italic">Awaiting Health Profile</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'derma' && (
                                <motion.div key="derma" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                                    <div className="space-y-12">
                                        <h2 className="text-5xl font-black tracking-tighter text-white italic uppercase italic leading-none">Vision <br/>Derm Core</h2>
                                        <p className="text-sm text-gray-500 italic font-serif leading-relaxed">"Autonomous computer vision for dermatological screening. Our CNN neural nodes analyze skin lesion morphology for immediate clinical concern stratification."</p>
                                        <label 
                                            onDragOver={e=>{e.preventDefault();setDragOver(true);}}
                                            onDragLeave={()=>setDragOver(false)}
                                            onDrop={e=>{e.preventDefault();setDragOver(false);analyzeSkin(e.dataTransfer.files[0]);}}
                                            className={`block w-full h-[450px] border border-dashed rounded-[50px] transition-all relative overflow-hidden flex flex-col items-center justify-center text-center p-12 group/img-node ${dragOver ? 'border-hospital-primary bg-hospital-primary/10' : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'}`}>
                                            {isSkinLoading ? (
                                                <div className="flex flex-col items-center gap-10">
                                                    <div className="w-24 h-24 border-4 border-hospital-primary/20 border-t-hospital-primary rounded-full animate-spin"></div>
                                                    <p className="text-[11px] font-black text-white uppercase tracking-[0.6em] animate-pulse italic">Scanning Visual Pixels...</p>
                                                </div>
                                            ) : skinImage ? (
                                                <div className="relative w-full h-full flex items-center justify-center">
                                                    <img src={skinImage} className="max-h-full rounded-[40px] object-contain shadow-4xl grayscale hover:grayscale-0 transition-all duration-1000" alt="Lesion Probe" />
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img-node:opacity-100 transition-opacity flex items-center justify-center">
                                                        <span className="text-[11px] font-black uppercase tracking-[0.4em] bg-white text-black px-10 py-5 rounded-full italic">Replace Probe</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-10 flex flex-col items-center">
                                                    <div className="w-32 h-32 rounded-[45px] bg-white/5 border border-white/10 flex items-center justify-center text-hospital-primary shadow-4xl group-hover/img-node:scale-110 transition-transform"><Microscope size={54} /></div>
                                                    <p className="text-2xl font-black text-white italic">Drop Skin Probe Node</p>
                                                    <p className="text-[9px] text-gray-700 uppercase tracking-[0.5em] font-black italic">Advanced Pattern Recognition Node Active</p>
                                                </div>
                                            )}
                                            <input type="file" className="hidden" accept="image/*" onChange={e=>analyzeSkin(e.target.files[0])} />
                                        </label>
                                    </div>
                                    <div className="bg-[#050505] rounded-[60px] p-16 border border-white/10 shadow-4xl flex flex-col justify-center relative shadow-inner overflow-hidden italic">
                                        <div className="absolute top-0 right-0 p-12 opacity-[0.02] -rotate-12"><Dna size={300} strokeWidth={1}/></div>
                                        {skinResult ? (
                                            <div className="space-y-12 relative z-10 transition-all">
                                                <div>
                                                    <p className="text-[10px] uppercase font-black tracking-[0.6em] text-white/30 mb-8 italic underline underline-offset-[10px] decoration-white/10">Neural Detection Log</p>
                                                    <h4 className="text-6xl font-black text-white glow-text tracking-tighter mb-8 italic">{skinResult.condition}</h4>
                                                    <div className="flex items-center gap-6">
                                                        <div className={`px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.4em] italic shadow-4xl border`} 
                                                            style={{ backgroundColor: `${skinResult.risk==='High'?'#ff3366':skinResult.risk==='Medium'?'#f59e0b':'#00cccc'}20`, color: skinResult.risk==='High'?'#ff3366':skinResult.risk==='Medium'?'#f59e0b':'#00cccc', borderColor: `${skinResult.risk==='High'?'#ff3366':skinResult.risk==='Medium'?'#f59e0b':'#00cccc'}40` }}>
                                                            {skinResult.risk} Clinical Priority
                                                        </div>
                                                        <span className="text-3xl font-black text-white italic">{skinResult.confidence}% <span className="text-[10px] text-gray-700 ml-2">CONFIDENCE</span></span>
                                                    </div>
                                                </div>
                                                <div className="pt-12 border-t border-white/5 space-y-10">
                                                    <div className="p-10 bg-white/5 rounded-[45px] border border-white/5 italic text-white/40 leading-loose text-sm font-serif">
                                                        <span className="block text-[10px] font-black text-hospital-primary mb-4 tracking-[0.5em]">AUTONOMOUS OBSERVATION:</span>
                                                        "Geometric lesion symmetry and chromatic distribution indices analyzed. Patterns detected are consistent with institutional models for {skinResult.condition.toLowerCase()}. Physical specialist validation is mandatory."
                                                    </div>
                                                    <a href="tel:9154404051" className="block w-full bg-white text-black py-8 rounded-[35px] text-[12px] font-black uppercase tracking-[0.6em] text-center shadow-4xl hover:bg-hospital-primary transition-all active:scale-95 italic">Initiate Human Triage</a>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center opacity-[0.03] space-y-10 py-12">
                                                <Eye size={200} strokeWidth={1}/>
                                                <p className="text-[14px] font-black uppercase tracking-[1em] italic text-center leading-loose">Awaiting Skin Probe Node</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Cyber Security Badges */}
                <div className="mt-32 flex flex-col md:flex-row items-center justify-between gap-12 py-12 border-t border-white/5">
                    <div className="flex flex-wrap items-center gap-10 justify-center">
                        {[
                            {i:<ShieldCheck size={24}/>,l:'HIPAA PROTOCOL v4.0',c:'text-hospital-primary'},
                            {i:<Dna size={22}/>,l:'NVIDIA CLINICAL CORE',c:'text-hospital-secondary'},
                            {i:<Cpu size={22}/>,l:'SRI KAMALA NEURAL NET',c:'text-white'}
                        ].map((b,idx)=>(
                            <div key={idx} className="flex items-center gap-5 px-8 py-4 bg-white/5 border border-white/5 rounded-3xl backdrop-blur-3xl shadow-4xl group hover:border-white/20 transition-all">
                               <div className={`${b.c} group-hover:scale-110 transition-transform`}>{b.i}</div>
                               <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] italic">{b.l}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-[10px] font-bold text-gray-800 uppercase tracking-[0.4em] italic leading-tight text-center md:text-right">Autonomous Health Nexus © 2026 Sri Kamala Medical Group. <br/>All Logic Clusters Encrypted.</p>
                </div>

            </div>

            {/* Ambient Background Elements */}
            <div className="absolute top-[30%] left-[-15%] opacity-[0.02] text-white rotate-45 pointer-events-none scale-150"><Scissors size={400} strokeWidth={1}/></div>
             <div className="absolute bottom-[30%] right-[-15%] opacity-[0.02] text-hospital-secondary -rotate-45 pointer-events-none scale-150"><Syringe size={400} strokeWidth={1}/></div>
             <div className="absolute top-[10%] left-1/2 -translate-x-1/2 opacity-[0.01] text-white pointer-events-none"><Dna size={800} strokeWidth={0.5}/></div>

        </div>
    );
};

export default AIHealthPage;
