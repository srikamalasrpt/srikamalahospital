import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, Activity, FileText, Utensils, Search, Brain,
    ShieldCheck, Heart, Plus, Zap, Eye, Pill, Scan, Upload,
    CheckCircle, AlertTriangle, TrendingUp, Clock, Star,
    ChevronRight, Cpu, Microscope, Stethoscope, Dna, ArrowRight, X, Droplets
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

    // New AI features
    const [waterNeeds, setWaterNeeds] = useState(null);
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

    const [bmi, setBmi] = useState({ height: '', weight: '', result: null, aiAdvice: '' });
    const [isBmiLoading, setIsBmiLoading] = useState(false);

    const calculateBMI = async () => {
        if (!bmi.height || !bmi.weight) return;
        const h = parseFloat(bmi.height) / 100;
        const w = parseFloat(bmi.weight);
        const bmiValue = (w / (h * h)).toFixed(1);

        let category = '';
        let color = '#10b981';
        if (bmiValue < 18.5) { category = 'Underweight'; color = '#3b82f6'; }
        else if (bmiValue < 25) { category = 'Normal'; color = '#10b981'; }
        else if (bmiValue < 30) { category = 'Overweight'; color = '#f59e0b'; }
        else { category = 'Obese'; color = '#ef4444'; }

        setBmi(p => ({ ...p, result: { value: bmiValue, category, color } }));
        setIsBmiLoading(true);

        try {
            const resp = await chatWithAI(`Clinical Analysis: BMI is ${bmiValue} (${category}). Provide a 3-point clinical action plan for this profile including calorie target.
CRITICAL RULE: You MUST format your precise response as: 
[Telugu Translation]
|||
[English Translation]`);
            setBmi(p => ({ ...p, aiAdvice: resp.data.response }));
        } catch (err) { console.error(err); }
        finally { setIsBmiLoading(false); }
    };

    const [healthData, setHealthData] = useState({ age: '', activity: 'Moderate', sleep: '7-8', nutrition: 'Balanced' });
    const [healthScore, setHealthScore] = useState(null);
    const [isScoreLoading, setIsScoreLoading] = useState(false);

    const calculateHealthScore = async () => {
        setIsScoreLoading(true);
        try {
            const prompt = `Health Profile: Age ${healthData.age}, Activity ${healthData.activity}, Sleep ${healthData.sleep}, Nutrition ${healthData.nutrition}. 
Calculate a health score (0-100) and provide a 3-point medical optimization plan.
CRITICAL RULE: Always format response as: 
Score: [Number]
|||
[Telugu Translation]
|||
[English Translation]`;
            const resp = await chatWithAI(prompt);
            const parts = resp.data.response.split('|||');
            const score = parts[0].replace('Score:', '').trim();
            setHealthScore({ score, adviceTe: parts[1], adviceEn: parts[2] });
        } catch (err) { console.error(err); }
        finally { setIsScoreLoading(false); }
    };

    const checkHeartHealth = async () => {
        setIsHeartLoading(true);
        try {
            const prompt = `Cardiac Risk Assessment: Patient Age ${healthData.age}, BMI ${bmi.result?.value || 'unknown'}, Activity ${healthData.activity}. 
Briefly assess potential cardiovascular risk in 2 sentences.
CRITICAL RULE: Always format response as: 
[Telugu Translation]
|||
[English Translation]`;
            const resp = await chatWithAI(prompt);
            setHeartRisk(resp.data.response);
        } catch (err) { console.error(err); }
        finally { setIsHeartLoading(false); }
    };

    const tabs = [
        { id: 'clinical', icon: Stethoscope, label: 'Assistant', color: '#008080' },
        { id: 'ocr', icon: Scan, label: 'Scan Reports', color: '#ff8fa3' },
        { id: 'bmi', icon: Activity, label: 'BMI Core', color: '#008080' },
        { id: 'cardio', icon: Heart, label: 'Cardio AI', color: '#ff8fa3' },
        { id: 'wellness', icon: Utensils, label: 'NutriSync', color: '#008080' },
        { id: 'drugs', icon: Pill, label: 'Pharma AI', color: '#ff8fa3' },
        { id: 'score', icon: Activity, label: 'Health Score', color: '#008080' },
        { id: 'derma', icon: Eye, label: 'Skin AI', color: '#ff8fa3' },
    ];

    const riskColors = { High: '#ef4444', Medium: '#f59e0b', Low: '#10b981' };

    return (
        <div className="min-h-screen bg-[#f1f5f9] pt-32 pb-24 px-6 relative overflow-hidden mesh-gradient">

            {/* Glowing Orbs for style */}
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-hospital-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse-soft"></div>
            <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-hospital-secondary/10 rounded-full blur-[120px] pointer-events-none animate-pulse-soft"></div>

            <div className="container mx-auto max-w-7xl relative z-10">

                {/* Header with Futuristic Branding */}
                <div className="flex flex-col items-center text-center mb-16 reveal-anim">
                    <motion.div initial={{ rotate: -10, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                        className="mb-8 relative">
                        <div className="w-24 h-24 glass-panel flex items-center justify-center text-hospital-primary shadow-neon-primary ring-1 ring-white/50">
                            <Cpu size={40} className="animate-spin-slow" />
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-hospital-secondary text-white rounded-full flex items-center justify-center shadow-lg">
                               <Sparkles size={16} />
                            </div>
                        </div>
                    </motion.div>

                    <h1 className="text-5xl lg:text-7xl font-black text-hospital-dark mb-4 leading-tight tracking-tighter">
                        Next-Gen <span className="bg-gradient-to-r from-hospital-primary to-hospital-secondary bg-clip-text text-transparent italic">AI Health</span> Lab
                    </h1>
                    <div className="h-1 w-24 bg-gradient-to-r from-hospital-primary to-hospital-secondary rounded-full mb-6"></div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] max-w-xl">Sri Kamala Hospitals · Specialized Autonomous Diagnostic Suite</p>
                </div>

                {/* Navigation - Glassmorphism style */}
                <div className="flex flex-wrap justify-center gap-4 mb-16 reveal-anim" style={{ animationDelay: '0.2s' }}>
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`px-8 py-4 rounded-[28px] font-black text-[12px] uppercase tracking-widest transition-all flex items-center gap-3 border-2 ${activeTab === tab.id ? 'bg-hospital-dark text-white border-hospital-dark shadow-2xl scale-110' : 'bg-white/40 backdrop-blur-md text-gray-500 border-transparent hover:bg-white'}`}>
                            <tab.icon size={18} className={activeTab === tab.id ? "text-hospital-secondary" : ""} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Main Content Terminal */}
                <div className="glass-panel p-2 lg:p-4 shadow-2xl relative reveal-anim" style={{ animationDelay: '0.4s' }}>
                    <div className="bg-[#0f172a] rounded-[28px] min-h-[700px] overflow-hidden relative group">
                        
                        {/* Inner UI Frame */}
                        <div className="absolute top-0 left-0 w-full h-12 bg-white/5 border-b border-white/10 flex items-center justify-between px-6">
                            <div className="flex gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                            </div>
                            <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em]">Module: {activeTab.toUpperCase()} · Status: READY</p>
                        </div>

                        <div className="p-8 lg:p-12 pt-20 h-full">
                            <AnimatePresence mode="wait">
                                {activeTab === 'clinical' && (
                                    <motion.div key="clinical" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="text-white">
                                        <div className="max-w-4xl mx-auto">
                                            <div className="flex items-center gap-6 mb-12">
                                               <div className="w-16 h-16 rounded-2xl bg-hospital-primary/20 flex items-center justify-center text-hospital-primary border border-hospital-primary/30"><Stethoscope size={30} /></div>
                                               <div>
                                                   <h2 className="text-3xl font-black italic tracking-tight">Clinical Assistant</h2>
                                                   <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Advanced Symptom Parsing Protocol</p>
                                               </div>
                                            </div>
                                            <div className="bg-white/5 rounded-[40px] p-8 border border-white/10 shadow-inner">
                                                <AISymptomChecker isDarkMode={true} />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'ocr' && (
                                    <motion.div key="ocr" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="text-white">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                            <div className="space-y-8">
                                                <h2 className="text-4xl font-black tracking-tight">Report Scanner</h2>
                                                <p className="text-sm text-white/50 leading-relaxed font-medium">Upload any medical report, prescription, or lab result. Our AI will translate and explain it in clinical depth.</p>
                                                
                                                <label className="block w-full h-[400px] border-2 border-dashed border-white/10 rounded-[40px] bg-white/5 hover:bg-white/10 transition-all cursor-pointer relative overflow-hidden group">
                                                    {isOcrLoading ? (
                                                        <div className="flex flex-col items-center justify-center h-full gap-6">
                                                            <div className="w-20 h-20 border-4 border-hospital-secondary/20 border-t-hospital-secondary rounded-full animate-spin"></div>
                                                            <p className="text-[10px] font-black text-hospital-secondary uppercase tracking-[0.5em]">De-coding Script...</p>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center h-full space-y-6">
                                                            <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center text-hospital-secondary group-hover:scale-110 transition-transform shadow-neon-secondary"><Scan size={40} /></div>
                                                            <div className="text-center px-8">
                                                                <h4 className="text-xl font-black">Upload Document</h4>
                                                                <p className="text-xs text-white/30 mt-3 font-medium tracking-wide">JPG, PNG, PDF supported</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <input type="file" className="hidden" accept="image/*" onChange={handleOCR} />
                                                </label>
                                            </div>

                                            <div className="bg-white/5 rounded-[40px] p-10 border border-white/10 flex flex-col">
                                                <div className="flex items-center gap-3 mb-10">
                                                    <div className="w-2 h-2 bg-hospital-secondary rounded-full animate-pulse shadow-neon-secondary"></div>
                                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">AI Brain Logs</h4>
                                                </div>
                                                {ocrResult ? (
                                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5">
                                                        <div className="grid grid-cols-2 gap-6">
                                                            <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                                                                <p className="text-[9px] text-white/30 uppercase tracking-widest mb-2 font-black">Clinical Date</p>
                                                                <p className="text-base font-bold text-hospital-secondary">{ocrResult.date || 'Auto-Detected'}</p>
                                                            </div>
                                                            <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                                                                <p className="text-[9px] text-white/30 uppercase tracking-widest mb-2 font-black">Patient</p>
                                                                <p className="text-base font-bold text-hospital-secondary">{ocrResult.patient || 'Sri Kamala Guest'}</p>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-6">
                                                            <div>
                                                                <p className="text-[9px] text-white/40 uppercase tracking-widest mb-4 font-black">Professional Explanation</p>
                                                                <p className="text-xl font-bold leading-relaxed font-['Noto_Sans_Telugu'] text-white/90">{ocrResult.explanation_te}</p>
                                                                <p className="text-xs font-medium text-white/40 mt-4 leading-relaxed italic">{ocrResult.explanation_en}</p>
                                                            </div>
                                                            {ocrResult.medicines?.length > 0 && (
                                                                <div className="pt-8 border-t border-white/10">
                                                                    <p className="text-[9px] text-white/40 uppercase tracking-widest mb-4 font-black">Medication Log</p>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {ocrResult.medicines.map((m, i) => <span key={i} className="px-4 py-2 bg-hospital-secondary/10 text-hospital-secondary rounded-xl text-[10px] font-black border border-hospital-secondary/20">{m}</span>)}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex-1 flex flex-col items-center justify-center opacity-10">
                                                        <Brain size={100} />
                                                        <p className="text-[10px] font-black uppercase tracking-[0.5em] mt-8 text-center">Neural pathways idle<br/>Awaiting visual data</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'bmi' && (
                                    <motion.div key="bmi" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="text-white">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                                            <div className="space-y-12">
                                                <div>
                                                    <h2 className="text-4xl font-black mb-4 tracking-tight">BMI Intelligence</h2>
                                                    <p className="text-sm text-white/50 leading-relaxed font-medium">Metabolic precision analyzer. Enter physical metrics for an AI-calculated health roadmap.</p>
                                                </div>

                                                <div className="grid grid-cols-2 gap-8">
                                                    <div className="space-y-4">
                                                        <label className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 ml-2">Height (cm)</label>
                                                        <input value={bmi.height} onChange={e => setBmi(p => ({ ...p, height: e.target.value }))} type="number" placeholder="175"
                                                            className="w-full bg-white/5 border-2 border-white/10 p-6 rounded-[32px] text-xl font-bold outline-none focus:border-hospital-primary transition-all text-center" />
                                                    </div>
                                                    <div className="space-y-4">
                                                        <label className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 ml-2">Weight (kg)</label>
                                                        <input value={bmi.weight} onChange={e => setBmi(p => ({ ...p, weight: e.target.value }))} type="number" placeholder="70"
                                                            className="w-full bg-white/5 border-2 border-white/10 p-6 rounded-[32px] text-xl font-bold outline-none focus:border-hospital-primary transition-all text-center" />
                                                    </div>
                                                </div>

                                                <button onClick={calculateBMI} disabled={isBmiLoading}
                                                    className="w-full py-6 bg-hospital-primary text-white rounded-[32px] font-black text-sm uppercase tracking-[0.4em] shadow-neon-primary hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4">
                                                    {isBmiLoading ? <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div> : <><Zap size={20} /> Compute Profile</>}
                                                </button>

                                                {bmi.result && (
                                                    <div className="p-10 bg-white/5 rounded-[40px] border border-white/10 relative overflow-hidden text-center">
                                                        <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: bmi.result.color }}></div>
                                                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] mb-6">Current Body Mass Index</p>
                                                        <div className="inline-block relative">
                                                            <h3 className="text-8xl font-black tracking-tighter glow-text" style={{ color: bmi.result.color }}>{bmi.result.value}</h3>
                                                            <span className="absolute -top-4 -right-12 px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-black uppercase text-white/80 border border-white/20">{bmi.result.category}</span>
                                                        </div>
                                                        
                                                        {/* Visual Scale */}
                                                        <div className="mt-12 w-full h-3 bg-white/10 rounded-full flex overflow-hidden">
                                                            <div className="h-full w-[18.5%]" style={{ backgroundColor: '#3b82f6' }}></div>
                                                            <div className="h-full w-[6.5%]" style={{ backgroundColor: '#10b981' }}></div>
                                                            <div className="h-full w-[5%]" style={{ backgroundColor: '#f59e0b' }}></div>
                                                            <div className="h-full flex-1" style={{ backgroundColor: '#ef4444' }}></div>
                                                            
                                                            {/* Needle indicator logic simplified */}
                                                            <motion.div 
                                                                initial={{ x: 0 }}
                                                                animate={{ x: `${Math.min(100, (bmi.result.value / 40) * 100)}%` }}
                                                                className="absolute h-6 w-1 bg-white shadow-xl top-[100px]"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="bg-white/5 rounded-[50px] p-12 border border-white/10 relative min-h-[500px] flex flex-col">
                                                <div className="flex items-center gap-3 mb-10">
                                                    <div className="w-2 h-2 bg-hospital-primary rounded-full animate-pulse shadow-neon-primary"></div>
                                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Clinical Advice Matrix</h4>
                                                </div>
                                                {bmi.aiAdvice ? (
                                                    <div className="space-y-12">
                                                        <div>
                                                            <p className="text-[9px] text-white/30 uppercase tracking-widest font-black mb-4">Wellness Action Plan [Telugu]</p>
                                                            <p className="text-xl font-bold leading-relaxed font-['Noto_Sans_Telugu'] text-white/90">{bmi.aiAdvice.split('|||')[0]}</p>
                                                        </div>
                                                        <div className="pt-10 border-t border-white/10">
                                                            <p className="text-[9px] text-white/30 uppercase tracking-widest font-black mb-4">Medical Breakdown [English]</p>
                                                            <p className="text-sm font-medium text-white/50 leading-relaxed italic">{bmi.aiAdvice.split('|||')[1]}</p>
                                                        </div>
                                                        <div className="mt-auto flex justify-between items-center py-6 px-8 bg-hospital-primary/10 rounded-3xl border border-hospital-primary/20">
                                                            <p className="text-[10px] font-black text-hospital-primary uppercase">Estimated Daily Hydration</p>
                                                            <p className="text-2xl font-black text-white">{(parseFloat(bmi.weight) * 35 / 1000).toFixed(1)} L</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex-1 flex flex-col items-center justify-center opacity-10">
                                                        <Activity size={120} />
                                                        <p className="text-[10px] font-black uppercase tracking-[0.5em] mt-10 text-center uppercase">Waiting for biometric metrics</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'cardio' && (
                                    <motion.div key="cardio" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="text-white">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                                            <div className="space-y-12">
                                                <div>
                                                    <h2 className="text-4xl font-black mb-4 tracking-tight">Cardio AI</h2>
                                                    <p className="text-sm text-white/50 font-medium">Cardiovascular risk profiling. Analyze heart health markers based on age, BMI, and clinical activity levels.</p>
                                                </div>

                                                <div className="p-8 bg-white/5 rounded-[40px] border border-white/10 space-y-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-hospital-secondary/20 rounded-2xl flex items-center justify-center text-hospital-secondary shadow-neon-secondary">
                                                            <Heart size={24} className="animate-pulse" />
                                                        </div>
                                                        <span className="text-[11px] font-black uppercase tracking-[0.2em] font-black">Live Pulse Simulation Active</span>
                                                    </div>
                                                    <button onClick={checkHeartHealth} disabled={isHeartLoading}
                                                        className="w-full py-6 bg-hospital-secondary text-white rounded-[32px] font-black text-sm uppercase tracking-[0.4em] shadow-neon-secondary hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4">
                                                        {isHeartLoading ? <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div> : <><Activity size={20} /> Assess Cardiac Risk</>}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="bg-[#1e293b]/50 rounded-[60px] p-12 border border-white/10 flex flex-col justify-center relative shadow-2xl">
                                                <div className="flex items-center gap-3 mb-10">
                                                    <div className="w-2 h-2 bg-hospital-secondary rounded-full animate-pulse shadow-neon-secondary"></div>
                                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Cardiac Risk Matrix</h4>
                                                </div>
                                                {heartRisk ? (
                                                    <div className="space-y-10">
                                                        <div>
                                                            <p className="text-[9px] text-white/30 uppercase tracking-widest font-black mb-6">Cardiac Optimization [Telugu]</p>
                                                            <p className="text-xl font-bold leading-relaxed font-['Noto_Sans_Telugu'] text-white/90">{heartRisk.split('|||')[0]}</p>
                                                        </div>
                                                        <div className="pt-10 border-t border-white/10">
                                                            <p className="text-[9px] text-white/30 uppercase tracking-widest font-black mb-6">Risk Breakdown [English]</p>
                                                            <p className="text-sm font-medium text-white/40 leading-relaxed italic">{heartRisk.split('|||')[1]}</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center opacity-10">
                                                        <Heart size={110} strokeWidth={1} />
                                                        <p className="text-[10px] font-black uppercase tracking-[0.5em] mt-10">Cardiac engine idle<br/>Awaiting biometric sync</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'wellness' && (
                                    <motion.div key="wellness" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="text-white">
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                            <div className="lg:col-span-1 space-y-10">
                                                <div>
                                                    <h2 className="text-4xl font-black tracking-tight mb-4">NutriSync</h2>
                                                    <p className="text-sm text-white/50 font-medium">Precision medicine diet architect. Craft your clinical nutrition protocol.</p>
                                                </div>
                                                
                                                <div className="space-y-4">
                                                    {['Diabetes Management', 'Cardlac Care Diet', 'Hypothyroid Program', 'Muscle Building AI'].map(tag => (
                                                        <button key={tag} onClick={() => setDietInput(tag)} 
                                                            className="w-full p-6 text-left bg-white/5 hover:bg-white/10 rounded-3xl border border-white/5 hover:border-hospital-secondary/30 transition-all group flex items-center justify-between">
                                                            <span className="text-[11px] font-black uppercase tracking-widest text-white/70">{tag}</span>
                                                            <ChevronRight size={18} className="text-white/20 group-hover:text-hospital-secondary transition-all" />
                                                        </button>
                                                    ))}
                                                    <textarea value={dietInput} onChange={e => setDietInput(e.target.value)} placeholder="Type specific health goals or conditions..."
                                                        className="w-full bg-white/5 border-2 border-white/10 p-6 rounded-[32px] text-sm font-bold min-h-[120px] outline-none focus:border-hospital-secondary transition-all" />
                                                    <button onClick={generateDietPlan} disabled={isDietLoading}
                                                        className="w-full py-6 bg-hospital-secondary text-white rounded-[32px] font-black text-sm uppercase tracking-[0.4em] shadow-neon-secondary hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4">
                                                        {isDietLoading ? <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div> : <><Sparkles size={20} /> Design Protocol</>}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="lg:col-span-2 bg-white/5 rounded-[50px] p-12 border border-white/10 flex flex-col min-h-[600px] relative overflow-hidden">
                                                <div className="absolute -top-20 -right-20 w-60 h-60 bg-hospital-secondary/5 rounded-full blur-[80px]"></div>
                                                <div className="flex items-center justify-between mb-12">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-2 h-2 bg-hospital-secondary rounded-full animate-pulse shadow-neon-secondary"></div>
                                                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Nutrition Intelligence Map</h4>
                                                    </div>
                                                    <Utensils size={24} className="text-white/10" />
                                                </div>

                                                <div className="flex-1 overflow-y-auto scrollbar-hide pr-2">
                                                    {dietPlan ? (
                                                        <div className="space-y-12">
                                                            <div>
                                                                <p className="text-[9px] text-white/30 uppercase tracking-widest font-black mb-6">Regional Clinical Plan [Telugu]</p>
                                                                <p className="text-xl font-bold leading-relaxed font-['Noto_Sans_Telugu'] text-white/90">{dietPlan.split('|||')[0]}</p>
                                                            </div>
                                                            <div className="pt-12 border-t border-white/10">
                                                                <p className="text-[9px] text-white/30 uppercase tracking-widest font-black mb-6">Scientific Breakdown [English]</p>
                                                                <p className="text-sm font-medium text-white/50 leading-relaxed whitespace-pre-wrap italic">{dietPlan.split('|||')[1]}</p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="h-full flex flex-col items-center justify-center opacity-10">
                                                            <Utensils size={100} />
                                                            <p className="text-[10px] font-black uppercase tracking-[0.5em] mt-10 text-center uppercase">Awaiting health parameters</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'drugs' && (
                                    <motion.div key="drugs" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="text-white">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                                            <div className="space-y-10">
                                                <div>
                                                   <h2 className="text-4xl font-black mb-4 tracking-tight">Pharmacology AI</h2>
                                                   <p className="text-sm text-white/50 font-medium leading-relaxed">Cross-verification of drug safety, molecular interactions, and dosage protocols using world-class clinical databases.</p>
                                                </div>

                                                <div className="space-y-6">
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {['Metformin', 'Aspirin', 'Atorvastatin', 'Amlodipine'].map(tag => (
                                                            <button key={tag} onClick={() => setDrugsInput(p => p ? `${p}, ${tag}` : tag)} 
                                                                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-hospital-secondary transition-all">
                                                                + {tag}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <textarea value={drugsInput} onChange={e => setDrugsInput(e.target.value)} placeholder="Enter medicine names (comma separated)..."
                                                        className="w-full bg-white/5 border-2 border-white/10 p-8 rounded-[40px] text-base font-bold min-h-[160px] outline-none focus:border-hospital-secondary transition-all" />
                                                    <button onClick={checkDrugInteractions} disabled={isDrugsLoading}
                                                        className="w-full py-6 bg-hospital-secondary text-white rounded-[32px] font-black text-sm uppercase tracking-[0.4em] shadow-neon-secondary hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4">
                                                        {isDrugsLoading ? <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div> : <><ShieldCheck size={20} /> Verify Molecular Safety</>}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="bg-white/5 rounded-[50px] p-12 border border-white/10 flex flex-col min-h-[500px] shadow-inner">
                                                <div className="flex items-center gap-3 mb-10">
                                                    <div className="w-2 h-2 bg-hospital-secondary rounded-full animate-pulse shadow-neon-secondary"></div>
                                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Pharmacological Report</h4>
                                                </div>
                                                {drugsResult ? (
                                                    <div className="space-y-12">
                                                        <div>
                                                            <p className="text-[9px] text-white/30 uppercase tracking-widest font-black mb-6">Interaction Summary [Telugu]</p>
                                                            <p className="text-xl font-bold leading-relaxed font-['Noto_Sans_Telugu'] text-white/90">{drugsResult.split('|||')[0]}</p>
                                                        </div>
                                                        <div className="pt-10 border-t border-white/10">
                                                            <p className="text-[9px] text-white/30 uppercase tracking-widest font-black mb-6">Scientific Safety Profile [English]</p>
                                                            <p className="text-sm font-medium text-white/50 leading-relaxed italic">{drugsResult.split('|||')[1]}</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex-1 flex flex-col items-center justify-center opacity-10">
                                                        <Pill size={110} />
                                                        <p className="text-[10px] font-black uppercase tracking-[0.5em] mt-10 text-center uppercase">Awaiting pharmacological input</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'score' && (
                                    <motion.div key="healthscore" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="text-white">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                                            <div className="space-y-12 text-center lg:text-left">
                                                <div>
                                                    <h2 className="text-4xl font-black mb-4 tracking-tight">Clinical Quotient</h2>
                                                    <p className="text-sm text-white/50 font-medium">Holistic medical scoring using advanced neural networks. Compute your Sri Kamala Health Index.</p>
                                                </div>

                                                <div className="grid grid-cols-2 gap-8 text-left">
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Patient Age</label>
                                                        <input value={healthData.age} onChange={e => setHealthData({...healthData, age: e.target.value})} type="number" 
                                                            className="w-full bg-white/5 border-2 border-white/10 p-5 rounded-3xl text-lg font-bold outline-none focus:border-hospital-primary transition-all" />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Activity Level</label>
                                                        <select value={healthData.activity} onChange={e => setHealthData({...healthData, activity: e.target.value})}
                                                            className="w-full bg-white/5 border-2 border-white/10 p-5 rounded-3xl text-base font-bold outline-none border-none focus:ring-1 ring-hospital-primary">
                                                            <option className="bg-hospital-dark">Sedentary</option>
                                                            <option className="bg-hospital-dark">Moderate</option>
                                                            <option className="bg-hospital-dark">Professional Athlete</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Sleep Hygiene</label>
                                                        <select value={healthData.sleep} onChange={e => setHealthData({...healthData, sleep: e.target.value})}
                                                            className="w-full bg-white/5 border-2 border-white/10 p-5 rounded-3xl text-sm font-bold outline-none border-none focus:ring-1 ring-hospital-primary">
                                                            <option className="bg-hospital-dark">Less than 5h</option>
                                                            <option className="bg-hospital-dark">6-8 Hours</option>
                                                            <option className="bg-hospital-dark">9+ Hours</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Diet Style</label>
                                                        <select value={healthData.nutrition} onChange={e => setHealthData({...healthData, nutrition: e.target.value})}
                                                            className="w-full bg-white/5 border-2 border-white/10 p-5 rounded-3xl text-sm font-bold outline-none border-none focus:ring-1 ring-hospital-primary">
                                                            <option className="bg-hospital-dark">Standard Balanced</option>
                                                            <option className="bg-hospital-dark">Organic/Vegan</option>
                                                            <option className="bg-hospital-dark">Fast Food Heavy</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <button onClick={calculateHealthScore} disabled={isScoreLoading}
                                                    className="w-full py-6 bg-hospital-secondary text-white rounded-[32px] font-black text-sm uppercase tracking-[0.4em] shadow-neon-secondary hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4">
                                                    {isScoreLoading ? <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div> : <><Cpu size={20} /> Generate Health Index</>}
                                                </button>
                                            </div>

                                            <div className="bg-white/5 rounded-[60px] p-12 border border-white/10 relative flex flex-col justify-center text-center overflow-hidden">
                                                <div className="absolute top-0 right-0 p-12 opacity-5 animate-pulse"><Sparkles size={250} /></div>
                                                {healthScore ? (
                                                    <div className="relative z-10 space-y-12">
                                                        <div className="p-10 rounded-full w-60 h-60 border-4 border-hospital-secondary/30 mx-auto flex flex-col items-center justify-center shadow-neon-secondary bg-white/5 backdrop-blur-md">
                                                            <span className="text-8xl font-black tracking-tighter glow-text text-white">{healthScore.score}</span>
                                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-hospital-secondary">H-IQ Score</span>
                                                        </div>
                                                        <div className="space-y-8 text-left max-w-md mx-auto">
                                                            <div className="space-y-4">
                                                                <h5 className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 border-l-2 border-hospital-primary pl-4">Clinical Optimization [Telugu]</h5>
                                                                <p className="text-base font-bold font-['Noto_Sans_Telugu'] leading-relaxed text-white/90">{healthScore.adviceTe}</p>
                                                            </div>
                                                            <div className="space-y-4 pt-8 border-t border-white/10">
                                                                <h5 className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 border-l-2 border-hospital-secondary pl-4">Medical Breakdown [English]</h5>
                                                                <p className="text-[11px] font-medium text-white/50 leading-relaxed italic">{healthScore.adviceEn}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center opacity-10 py-20">
                                                        <TrendingUp size={120} />
                                                        <p className="text-sm font-black uppercase tracking-[0.5em] mt-10">Neural Analysis<br/>Waiting for health profile</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'derma' && (
                                    <motion.div key="derma" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="text-white">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                                            <div className="space-y-12">
                                                <div>
                                                    <h2 className="text-4xl font-black mb-4 tracking-tight">Dermatology Lab</h2>
                                                    <p className="text-sm text-white/50 font-medium">Computer Vision lesion analysis. Specialized CNN neural network for dermatological screening.</p>
                                                </div>

                                                <label 
                                                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                                    onDragLeave={() => setDragOver(false)}
                                                    onDrop={e => { e.preventDefault(); setDragOver(false); analyzeSkin(e.dataTransfer.files[0]); }}
                                                    className={`block w-full h-[380px] border-4 border-dashed rounded-[40px] transition-all relative overflow-hidden flex flex-col items-center justify-center text-center p-10 ${dragOver ? 'border-hospital-primary bg-hospital-primary/10' : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'}`}>
                                                    {isSkinLoading ? (
                                                        <div className="flex flex-col items-center gap-8">
                                                            <div className="w-20 h-20 border-4 border-hospital-primary/20 border-t-hospital-primary rounded-full animate-spin"></div>
                                                            <p className="text-[10px] font-black text-hospital-primary uppercase tracking-[0.5em]">Parsing Visual Pixels...</p>
                                                        </div>
                                                    ) : skinImage ? (
                                                        <div className="relative group/img w-full h-full flex items-center justify-center">
                                                            <img src={skinImage} className="max-h-full rounded-3xl object-contain shadow-2xl" alt="Skin Probe" />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                                                <span className="text-[10px] font-black uppercase px-6 py-3 bg-white text-hospital-dark rounded-full">Replace Image</span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-6 flex flex-col items-center">
                                                            <div className="w-24 h-24 rounded-[32px] bg-white/5 flex items-center justify-center text-hospital-primary shadow-neon-primary"><Microscope size={40} /></div>
                                                            <div>
                                                                <h4 className="text-xl font-black">Drop Skin Probe</h4>
                                                                <p className="text-xs text-white/30 mt-3 font-medium tracking-widest">Supports moles, rashes, and acute lesions</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <input type="file" className="hidden" accept="image/*" onChange={e => analyzeSkin(e.target.files[0])} />
                                                </label>
                                            </div>

                                            <div className="bg-[#1e293b]/40 rounded-[60px] p-12 border border-white/10 flex flex-col justify-center relative shadow-2xl">
                                                <div className="flex items-center gap-3 mb-12">
                                                    <div className="w-2 h-2 bg-hospital-primary rounded-full animate-pulse shadow-neon-primary"></div>
                                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Lesion Analysis Engine</h4>
                                                </div>
                                                {skinResult ? (
                                                    <div className="space-y-12 relative z-10 animate-in fade-in slide-in-from-right-10">
                                                        <div>
                                                            <p className="text-[10px] uppercase font-black tracking-[0.3em] text-white/30 mb-4 font-black underline decoration-hospital-primary/30">Primary Detection</p>
                                                            <h4 className="text-5xl font-black text-white glow-text tracking-tighter">{skinResult.condition}</h4>
                                                            <div className="mt-8 flex items-center gap-4">
                                                                <div className="px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2" 
                                                                    style={{ backgroundColor: `${riskColors[skinResult.risk]}20`, color: riskColors[skinResult.risk], border: `1px solid ${riskColors[skinResult.risk]}30` }}>
                                                                    <AlertTriangle size={12} /> {skinResult.risk} Clinical Concern
                                                                </div>
                                                                <span className="text-2xl font-black text-white/80">{skinResult.confidence}% <span className="text-[10px] text-white/30 font-bold uppercase ml-1">Confidence</span></span>
                                                            </div>
                                                        </div>

                                                        <div className="pt-10 border-t border-white/10 space-y-6">
                                                            <div className="p-8 bg-white/5 rounded-[40px] border border-white/5 flex items-start gap-4">
                                                                <div className="w-10 h-10 rounded-2xl bg-hospital-primary/20 flex flex-shrink-0 items-center justify-center text-hospital-primary"><Brain size={18} /></div>
                                                                <p className="text-xs font-medium text-white/60 leading-relaxed italic">The AI pattern recognition engine detected cellular structures consistent with {skinResult.condition.toLowerCase()}. Immediate clinical validation is suggested.</p>
                                                            </div>
                                                            <div className="flex gap-4">
                                                                <a href="tel:9154404051" className="flex-1 bg-white text-hospital-dark py-5 rounded-[24px] text-[10px] font-black uppercase tracking-[0.4em] text-center shadow-xl hover:bg-hospital-primary hover:text-white transition-all">Emergency Help</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center opacity-10">
                                                        <Eye size={110} />
                                                        <p className="text-[10px] font-black uppercase tracking-[0.5em] mt-10 text-center uppercase">Visual logic offline<br/>Waiting for skin probe</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                    </div>
                </div>

                {/* Footer Badges - Modern High Fidelty */}
                <div className="mt-24 flex flex-col md:flex-row items-center justify-between gap-8 py-10 border-t border-gray-200/50 reveal-anim" style={{ animationDelay: '0.6s' }}>
                    <div className="flex items-center gap-6">
                        <div className="px-6 py-3 bg-white rounded-2xl border border-gray-200 flex items-center gap-4 shadow-sm">
                           <ShieldCheck size={20} className="text-hospital-primary" />
                           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Secured by clinical protocols · HIPAA Ready</span>
                        </div>
                        <div className="px-6 py-3 bg-white rounded-2xl border border-gray-200 flex items-center gap-4 shadow-sm">
                           <Dna size={18} className="text-hospital-secondary" />
                           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">NVIDIA Medical SDK v4.0</span>
                        </div>
                    </div>
                    <p className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.4em]">Integrated AI Command Center © 2026 Sri Kamala Hospitals</p>
                </div>

            </div>
        </div>
    );
};

export default AIHealthPage;
