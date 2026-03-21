import React, { useState, useRef } from 'react';
import { Sparkles, Send, Brain, ShieldAlert, Activity, ChevronRight, RefreshCw, Upload, Image as ImageIcon, X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AISymptomChecker = () => {
    const [symptoms, setSymptoms] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const fileInputRef = useRef(null);
    const toArray = (value) => {
        if (Array.isArray(value)) return value;
        if (value === null || value === undefined) return [];
        return [value];
    };
    const getBilingualText = (value) => {
        if (value === null || value === undefined) return '-';
        if (typeof value === 'object') return value.te || value.en || '-';
        return String(value);
    };
    const joinItems = (value) => {
        const list = toArray(value);
        if (!list.length) return '-';
        return list.map((item) => getBilingualText(item)).join(', ');
    };
    const isEmergencyCase = (analysis) => {
        const bag = [
            getBilingualText(analysis?.condition),
            joinItems(analysis?.precautions),
            joinItems(analysis?.requirements),
            joinItems(analysis?.lab_tests),
            joinItems(analysis?.medicine)
        ].join(' ').toLowerCase();
        const emergencyKeywords = [
            'emergency', 'urgent', 'immediate', 'critical', 'severe',
            'చాలా తీవ్రం', 'అత్యవసరం', 'తక్షణం', 'గంభీర', 'ఎమర్జెన్సీ'
        ];
        return emergencyKeywords.some((key) => bag.includes(key));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!symptoms.trim() && !imagePreview) return;
        
        setIsAnalyzing(true);
        setResult(null);

        try {
            const { analyzeSymptoms, analyzeVisionImage } = await import('../utils/api');
            let resp;
            if (imagePreview) {
                resp = await analyzeVisionImage(imagePreview, symptoms);
            } else {
                resp = await analyzeSymptoms(symptoms);
            }

            if (resp.data.success && resp.data.analysis) {
                setResult(resp.data.analysis);
            } else if (resp.data.analysis) {
                setResult(resp.data.analysis);
            } else {
                setResult({
                    advice: { en: "AI system is currently overloaded. Please try again later.", te: "AI సిస్టమ్ ప్రస్తుతం అందుబాటులో లేదు. దయచేసి తర్వాత మళ్లీ ప్రయత్నించండి." },
                    department: { en: "General", te: "జనరల్" }
                });
            }
        } catch (err) {
            console.error("AI Error:", err);
            setResult({
                advice: { en: "Cannot connect to clinical AI network. Call +91 99480 76665 for queries.", te: "క్లినికల్ AI నెట్‌వర్క్‌కి కనెక్ట్ కాలేదు. సందేహాల కోసం +91 99480 76665 కి కాల్ చేయండి." },
                department: { en: "Support", te: "మద్దతు" }
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <section className="py-20 px-6 bg-white relative overflow-hidden">
            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
                    
                    {/* Visual Side */}
                    <div className="lg:w-2/5 relative">
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} className="relative z-10">
                            <div className="w-full aspect-square bg-hospital-dark rounded-[60px] p-10 flex flex-col justify-between text-white shadow-2xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-hospital-primary opacity-5 group-hover:opacity-10 transition-opacity"></div>
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-8"><Brain size={24} className="text-hospital-secondary" /></div>
                                    <h2 className="text-3xl font-black leading-none mb-4 font-['Noto_Sans_Telugu']">AI హెల్త్ పవర్</h2>
                                    <p className="text-[7.5px] uppercase font-bold tracking-[0.3em] text-hospital-secondary mb-6 leading-none">Neural Diagnostic Intelligence</p>
                                    <p className="text-white/40 text-[10px] font-medium max-w-sm leading-relaxed">Synchronize your symptoms with our clinical neural network for instant preliminary advice.</p>
                                </div>
                                
                                <div className="relative z-10 flex gap-4">
                                    <div className="flex-1 p-4 bg-white/5 rounded-[24px] border border-white/5">
                                        <p className="text-[7px] font-black uppercase tracking-widest text-[#ff8fa3] mb-1">ACCURACY</p>
                                        <p className="text-lg font-black tabular-nums">94.2%</p>
                                    </div>
                                    <div className="flex-1 p-4 bg-white/5 rounded-[24px] border border-white/5">
                                        <p className="text-[7px] font-black uppercase tracking-widest text-emerald-400 mb-1">LATENCY</p>
                                        <p className="text-lg font-black tabular-nums">&lt; 2S</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Interaction Side */}
                    <div className="lg:w-3/5 w-full space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-hospital-secondary/10 flex items-center justify-center text-hospital-secondary shadow-lg"><Activity size={16} /></div>
                            <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-hospital-primary underline decoration-hospital-secondary/30">AI Symptom Checker</h4>
                        </div>
                        
                        <div className="space-y-2">
                            <h3 className="text-3xl font-black text-hospital-dark font-['Noto_Sans_Telugu'] leading-tight">మీరు ఈరోజు <span className="text-hospital-secondary italic">ఎలా</span> ఉన్నారు?</h3>
                            <p className="text-[8px] uppercase font-bold text-gray-300 tracking-[0.3em] leading-none mb-4">Patient Symptom Analysis Interface</p>
                            <p className="text-xs text-gray-400">Describe your symptoms below. Our AI provides clinical guidance, but always consult a doctor.</p>
                        </div>

                        <form onSubmit={handleAnalyze} className="relative">
                            <div className="bg-gray-50 border-2 border-transparent focus-within:border-hospital-primary focus-within:bg-white rounded-[32px] p-6 shadow-inner transition-all relative">
                                <textarea 
                                    value={symptoms} 
                                    onChange={(e) => setSymptoms(e.target.value)}
                                    placeholder="ఉదాహరణ: నిన్నటి నుండి నాకు రొమ్ములో నొప్పిగా ఉంది..."
                                    className="w-full bg-transparent h-24 outline-none text-sm font-bold placeholder:text-gray-300 resize-none" 
                                />
                                
                                <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-2">
                                    <div className="flex items-center gap-4">
                                        <button 
                                            type="button" 
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm text-hospital-primary hover:bg-hospital-primary hover:text-white transition-all border border-gray-100"
                                        >
                                            <Upload size={14} />
                                            <span className="text-[9px] font-black uppercase tracking-widest leading-none">Upload Image</span>
                                        </button>
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            ref={fileInputRef} 
                                            onChange={handleImageChange} 
                                            className="hidden" 
                                        />
                                        
                                        {imagePreview && (
                                            <div className="relative group">
                                                <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden border-2 border-hospital-primary">
                                                    <img src={imagePreview} alt="upload" className="w-full h-full object-cover" />
                                                </div>
                                                <button 
                                                    type="button" 
                                                    onClick={() => setImagePreview(null)}
                                                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center scale-0 group-hover:scale-100 transition-all shadow-lg"
                                                >
                                                    <X size={10} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center mt-6">
                                <div className="flex items-center gap-2 text-[8px] font-black uppercase text-rose-400 leading-none">
                                    <ShieldAlert size={12} /> <span className="font-['Noto_Sans_Telugu'] text-[10px] tracking-normal">డేటా గోప్యత హామీ (AI Vision Enabled)</span>
                                </div>
                                <button type="submit" disabled={isAnalyzing || (!symptoms.trim() && !imagePreview)}
                                    className="premium-button bg-hospital-dark text-white px-8 py-4 shadow-xl disabled:opacity-50 min-w-none border-none">
                                    {isAnalyzing ? <RefreshCw size={16} className="animate-spin" /> : <><span className="font-['Noto_Sans_Telugu'] text-lg mr-2 font-bold tracking-tight leading-none">విశ్లేషించండి</span> <span className="text-[8px] tracking-widest opacity-40 uppercase">/ Analyze</span></>}
                                </button>
                            </div>
                        </form>

                        <AnimatePresence>
                            {result && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    className="p-8 rounded-[40px] bg-hospital-primary/5 border border-hospital-primary/10 relative overflow-hidden group mt-8">
                                    <div className="absolute top-0 right-0 p-6 text-hospital-primary/5 group-hover:rotate-12 transition-transform"><Brain size={100} /></div>
                                    <div className="relative z-10 w-full">
                                        <div className="flex flex-wrap items-center gap-2 mb-6">
                                            <span className="px-3 py-1 bg-hospital-primary text-white text-[8px] font-black uppercase tracking-widest rounded-full">{result.condition ? 'Visual AI Insight' : 'AI Preliminary Insight'}</span>
                                            {result.department && <span className="px-3 py-1 bg-hospital-secondary text-white font-black text-[10px] font-['Noto_Sans_Telugu'] rounded-full">విభాగం: {result.department.te}</span>}
                                        </div>
                                        
                                        {result.condition ? (
                                            <div className="w-full mb-6 space-y-4">
                                                {isEmergencyCase(result) && (
                                                    <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700">
                                                        <p className="text-[10px] font-black uppercase tracking-widest mb-1">Emergency Alert</p>
                                                        <p className="text-sm font-bold">Serious indicators detected. Please go to hospital emergency immediately.</p>
                                                    </div>
                                                )}
                                                <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
                                                    <table className="w-full text-left min-w-[640px]">
                                                        <thead className="bg-gray-50">
                                                            <tr>
                                                                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500">Category</th>
                                                                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500">Clinical Summary</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr className="border-t border-gray-100 align-top">
                                                                <td className="px-4 py-3 text-xs font-black text-hospital-dark">Cause / Condition</td>
                                                                <td className="px-4 py-3 text-xs font-medium text-gray-700">{getBilingualText(result.condition)}</td>
                                                            </tr>
                                                            <tr className="border-t border-gray-100 align-top">
                                                                <td className="px-4 py-3 text-xs font-black text-hospital-dark">Precautions</td>
                                                                <td className="px-4 py-3 text-xs font-medium text-gray-700">{joinItems(result.precautions)}</td>
                                                            </tr>
                                                            <tr className="border-t border-gray-100 align-top">
                                                                <td className="px-4 py-3 text-xs font-black text-hospital-dark">Requirements</td>
                                                                <td className="px-4 py-3 text-xs font-medium text-gray-700">{joinItems(result.requirements)}</td>
                                                            </tr>
                                                            <tr className="border-t border-gray-100 align-top">
                                                                <td className="px-4 py-3 text-xs font-black text-hospital-dark">Lab Tests</td>
                                                                <td className="px-4 py-3 text-xs font-medium text-gray-700">{joinItems(result.lab_tests)}</td>
                                                            </tr>
                                                            <tr className="border-t border-gray-100 align-top">
                                                                <td className="px-4 py-3 text-xs font-black text-hospital-dark">Small Medicines</td>
                                                                <td className="px-4 py-3 text-xs font-medium text-gray-700">{joinItems(result.medicine)}</td>
                                                            </tr>
                                                            {result.note && (
                                                                <tr className="border-t border-gray-100 align-top bg-yellow-50/30">
                                                                    <td className="px-4 py-3 text-xs font-black text-hospital-secondary">Clinical Note</td>
                                                                    <td className="px-4 py-3 text-[10px] font-medium text-gray-600 italic leading-relaxed">{result.note}</td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4 mb-6">
                                                <p className="text-hospital-dark font-black text-xl leading-snug font-['Noto_Sans_Telugu']">{result.advice?.te}</p>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed italic">{result.advice?.en}</p>
                                            </div>
                                        )}

                                        <button onClick={() => window.scrollTo({ top: document.getElementById('booking').offsetTop, behavior: 'smooth' })}
                                            className="text-[9px] font-black uppercase tracking-widest text-white bg-hospital-dark px-4 py-2 rounded-full inline-flex items-center gap-2 group/btn hover:bg-hospital-primary transition-all shadow-md">
                                            <span className="font-['Noto_Sans_Telugu'] text-xs font-black tracking-normal lowercase">డాక్టర్‌ని సంప్రదించండి</span> <ChevronRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AISymptomChecker;
