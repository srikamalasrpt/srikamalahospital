import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, Activity, FileText, Utensils, Search, Brain,
    ShieldCheck, Heart, Plus, Zap, Eye, Pill, Scan, Upload,
    CheckCircle, AlertTriangle, TrendingUp, Clock, Star,
    ChevronRight, Cpu, Microscope, Stethoscope, Dna
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
        { id: 'clinical', icon: Stethoscope, label: 'Clinical Triage', sub: 'Symptom AI', color: '#6366f1' },
        { id: 'ocr', icon: Scan, label: 'Report Scanner', sub: 'AI OCR', color: '#06b6d4' },
        { id: 'wellness', icon: Utensils, label: 'Wellness AI', sub: 'Diet Plan', color: '#10b981' },
        { id: 'drugs', icon: Pill, label: 'Medicine AI', sub: 'Drug Check', color: '#f59e0b' },
        { id: 'derma', icon: Eye, label: 'Dermatology', sub: 'Skin AI', color: '#ec4899' },
    ];

    const stats = [
        { icon: Cpu, value: '10K+', label: 'Images Trained', color: '#6366f1' },
        { icon: TrendingUp, value: '84%', label: 'AI Accuracy', color: '#10b981' },
        { icon: Clock, value: '<2s', label: 'Response Time', color: '#06b6d4' },
        { icon: Star, value: '7', label: 'Conditions', color: '#f59e0b' },
    ];

    const riskColors = { High: '#ef4444', Medium: '#f59e0b', Low: '#10b981' };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)', paddingTop: '5rem', paddingBottom: '4rem', overflow: 'hidden', position: 'relative' }}>

            {/* Animated BG Orbs */}
            <div style={{ position: 'absolute', top: '10%', left: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', pointerEvents: 'none', animation: 'pulse 4s ease-in-out infinite' }} />
            <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)', pointerEvents: 'none', animation: 'pulse 6s ease-in-out infinite' }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>

                {/* Header */}
                <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 100, padding: '8px 20px', marginBottom: '1.5rem', backdropFilter: 'blur(10px)' }}>
                        <Sparkles size={14} color="#6366f1" />
                        <span style={{ color: '#6366f1', fontSize: 10, fontWeight: 900, letterSpacing: '0.4em', textTransform: 'uppercase' }}>Multimodal Clinical AI v3.2</span>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }} />
                    </div>

                    <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 900, lineHeight: 1, marginBottom: '1rem', background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        AI <span style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ఆరోగ్య</span> కేంద్రం
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase' }}>Sri Kamala Hospitals · Central AI Command Dashboard</p>
                </motion.div>

                {/* Stats Bar */}
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: '2.5rem' }}>
                    {stats.map((s, i) => (
                        <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '1.25rem', backdropFilter: 'blur(10px)', textAlign: 'center' }}>
                            <s.icon size={20} color={s.color} style={{ marginBottom: 8 }} />
                            <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{s.value}</div>
                            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>{s.label}</div>
                        </div>
                    ))}
                </motion.div>

                {/* Tabs */}
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: '2.5rem', justifyContent: 'center' }}>
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: '14px 24px', borderRadius: 16, border: `1px solid ${activeTab === tab.id ? tab.color : 'rgba(255,255,255,0.08)'}`,
                                background: activeTab === tab.id ? `linear-gradient(135deg, ${tab.color}22, ${tab.color}11)` : 'rgba(255,255,255,0.03)',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.3s',
                                backdropFilter: 'blur(10px)', transform: activeTab === tab.id ? 'scale(1.03)' : 'scale(1)',
                                boxShadow: activeTab === tab.id ? `0 0 30px ${tab.color}30` : 'none'
                            }}>
                            <tab.icon size={18} color={activeTab === tab.id ? tab.color : 'rgba(255,255,255,0.4)'} />
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 800, lineHeight: 1 }}>{tab.label}</div>
                                <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: 3 }}>{tab.sub}</div>
                            </div>
                        </button>
                    ))}
                </motion.div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">

                    {/* Clinical */}
                    {activeTab === 'clinical' && (
                        <motion.div key="clinical" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 32, overflow: 'hidden', backdropFilter: 'blur(20px)' }}>
                                <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Stethoscope size={20} color="#6366f1" />
                                    </div>
                                    <div>
                                        <div style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>Clinical Triage & Symptom Analysis</div>
                                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em' }}>AI-Powered Diagnosis Assistant</div>
                                    </div>
                                </div>
                                <div style={{ padding: '1.5rem' }}>
                                    <AISymptomChecker dark />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* OCR Report Scanner */}
                    {activeTab === 'ocr' && (
                        <motion.div key="ocr" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 32, padding: '2.5rem', backdropFilter: 'blur(20px)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '2rem' }}>
                                    <div style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(6,182,212,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Scan size={24} color="#06b6d4" />
                                    </div>
                                    <div>
                                        <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 24, margin: 0 }}>Medical Report Scanner</h2>
                                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', margin: 0 }}>Digitize Handwriting & Prescriptions via AI OCR</p>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 24 }}>
                                    <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 320, border: '2px dashed rgba(6,182,212,0.3)', borderRadius: 24, cursor: 'pointer', background: 'rgba(6,182,212,0.05)', transition: 'all 0.3s', textAlign: 'center', padding: '2rem' }}>
                                        {isOcrLoading ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                                                <div style={{ width: 56, height: 56, borderRadius: '50%', border: '3px solid rgba(6,182,212,0.2)', borderTopColor: '#06b6d4', animation: 'spin 1s linear infinite' }} />
                                                <p style={{ color: '#06b6d4', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em' }}>AI Reading Document...</p>
                                            </div>
                                        ) : (
                                            <>
                                                <div style={{ width: 72, height: 72, borderRadius: 20, background: 'rgba(6,182,212,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                                                    <Upload size={32} color="#06b6d4" />
                                                </div>
                                                <p style={{ color: '#fff', fontWeight: 800, fontSize: 16, marginBottom: 8 }}>Upload Medical Report</p>
                                                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>JPG, PNG, PDF • Max 10MB</p>
                                                <div style={{ marginTop: 24, padding: '10px 24px', background: 'rgba(6,182,212,0.15)', borderRadius: 12, color: '#06b6d4', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                                                    Choose File
                                                </div>
                                            </>
                                        )}
                                        <input type="file" style={{ display: 'none' }} accept="image/*" onChange={handleOCR} />
                                    </label>

                                    <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 24, padding: '1.5rem', border: '1px solid rgba(255,255,255,0.06)', minHeight: 320 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
                                            <Sparkles size={14} color="#06b6d4" />
                                            <span style={{ color: '#06b6d4', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em' }}>AI Extracted Results</span>
                                        </div>
                                        {ocrResult ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                                    {[
                                                        { label: 'Patient', value: ocrResult.patient || 'Generic' },
                                                        { label: 'Date', value: ocrResult.date || 'Today' }
                                                    ].map((item, i) => (
                                                        <div key={i} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '12px' }}>
                                                            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 4 }}>{item.label}</p>
                                                            <p style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>{item.value}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                                {ocrResult.test_results?.length > 0 && (
                                                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, overflow: 'hidden' }}>
                                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                                                            <thead>
                                                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                                                    {['Test', 'Value', 'Range'].map(h => (
                                                                        <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: 'rgba(255,255,255,0.3)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: 9 }}>{h}</th>
                                                                    ))}
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {ocrResult.test_results.slice(0, 6).map((t, idx) => (
                                                                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                                                        <td style={{ padding: '10px 12px', color: '#06b6d4', fontWeight: 700 }}>{t.item_te || t.item_en}</td>
                                                                        <td style={{ padding: '10px 12px', color: '#fff', fontWeight: 800 }}>{t.value}</td>
                                                                        <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.4)' }}>{t.range}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, lineHeight: 1.7 }}>{ocrResult.explanation_en || ocrResult.diagnosis}</p>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.2, gap: 12 }}>
                                                <FileText size={48} color="#fff" />
                                                <p style={{ color: '#fff', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Awaiting Document</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Wellness / Diet */}
                    {activeTab === 'wellness' && (
                        <motion.div key="wellness" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 24 }}>
                                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 28, padding: '2rem', backdropFilter: 'blur(20px)' }}>
                                    <div style={{ width: 56, height: 56, borderRadius: 18, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                        <Utensils size={26} color="#10b981" />
                                    </div>
                                    <h3 style={{ color: '#fff', fontWeight: 900, fontSize: 22, marginBottom: 8 }}>Diet AI Specialist</h3>
                                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, lineHeight: 1.7, marginBottom: '1.5rem' }}>Enter your condition or health goals to generate a precision medical diet plan.</p>

                                    {['Type 2 Diabetes', 'Hypertension', 'Weight Loss', 'Post-Surgery'].map((tag, i) => (
                                        <button key={i} onClick={() => setDietInput(tag)}
                                            style={{ margin: '0 6px 8px 0', padding: '6px 14px', borderRadius: 100, border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.08)', color: '#10b981', fontSize: 11, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
                                            {tag}
                                        </button>
                                    ))}

                                    <textarea value={dietInput} onChange={(e) => setDietInput(e.target.value)}
                                        placeholder="e.g. Type 2 Diabetes, High Blood Pressure..."
                                        style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '1rem', minHeight: 120, color: '#fff', fontSize: 13, fontWeight: 600, outline: 'none', resize: 'none', marginTop: '1rem', boxSizing: 'border-box', fontFamily: 'inherit' }} />

                                    <button onClick={generateDietPlan} disabled={isDietLoading}
                                        style={{ width: '100%', marginTop: '1rem', padding: '14px', borderRadius: 16, border: 'none', background: isDietLoading ? 'rgba(16,185,129,0.3)' : 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', fontWeight: 900, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.2em', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                        {isDietLoading ? <><div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 1s linear infinite' }} /> Generating...</> : <><Zap size={16} /> Generate Plan</>}
                                    </button>
                                </div>

                                <div style={{ background: 'rgba(0,0,0,0.5)', borderRadius: 28, padding: '2rem', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', minHeight: 480, display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.5rem' }}>
                                        <Heart size={16} color="#10b981" />
                                        <span style={{ color: '#10b981', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em' }}>AI Nutritionist Response</span>
                                    </div>
                                    <div style={{ flex: 1, overflowY: 'auto' }}>
                                        {dietPlan ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                                {dietPlan.includes('|||') ? (
                                                    <>
                                                        <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 16, padding: '1.25rem' }}>
                                                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 10 }}>Telugu</p>
                                                            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, lineHeight: 1.8, fontFamily: "'Noto Sans Telugu', sans-serif", whiteSpace: 'pre-wrap' }}>{dietPlan.split('|||')[0].trim()}</p>
                                                        </div>
                                                        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: '1.25rem' }}>
                                                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 10 }}>English</p>
                                                            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{dietPlan.split('|||')[1].trim()}</p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{dietPlan}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.15, gap: 12 }}>
                                                <Utensils size={64} color="#fff" />
                                                <p style={{ color: '#fff', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.3em' }}>Awaiting Input</p>
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ marginTop: '1rem', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>⚕️ This plan is AI-generated. Clinical oversight required before starting new dietary regimens.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Drug Interactions */}
                    {activeTab === 'drugs' && (
                        <motion.div key="drugs" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 28, padding: '2.5rem', backdropFilter: 'blur(20px)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '2rem' }}>
                                    <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Pill size={24} color="#f59e0b" />
                                    </div>
                                    <div>
                                        <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 22, margin: 0 }}>Drug Interaction Analyzer</h2>
                                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', margin: 0 }}>AI-Powered Drug Safety Intelligence</p>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 24 }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                            {['Aspirin', 'Ibuprofen', 'Paracetamol', 'Warfarin', 'Metformin'].map((med, i) => (
                                                <button key={i} onClick={() => setDrugsInput(p => p ? `${p}, ${med}` : med)}
                                                    style={{ padding: '6px 14px', borderRadius: 100, border: '1px solid rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.08)', color: '#f59e0b', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                    <Plus size={10} /> {med}
                                                </button>
                                            ))}
                                        </div>
                                        <textarea value={drugsInput} onChange={(e) => setDrugsInput(e.target.value)}
                                            placeholder="Enter medicines separated by commas..."
                                            style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '1rem', minHeight: 140, color: '#fff', fontSize: 13, fontWeight: 600, outline: 'none', resize: 'none', fontFamily: 'inherit' }} />
                                        <button onClick={checkDrugInteractions} disabled={isDrugsLoading}
                                            style={{ padding: '14px', borderRadius: 16, border: 'none', background: isDrugsLoading ? 'rgba(245,158,11,0.3)' : 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', fontWeight: 900, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.2em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                            {isDrugsLoading ? <><div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 1s linear infinite' }} /> Analyzing...</> : <><ShieldCheck size={16} /> Analyze Safety</>}
                                        </button>
                                    </div>

                                    <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 20, padding: '1.5rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
                                            <AlertTriangle size={14} color="#f59e0b" />
                                            <span style={{ color: '#f59e0b', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Safety Report</span>
                                        </div>
                                        {drugsResult ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                                {drugsResult.includes('|||') ? (
                                                    <>
                                                        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, lineHeight: 1.8, whiteSpace: 'pre-wrap', fontFamily: "'Noto Sans Telugu', sans-serif" }}>{drugsResult.split('|||')[0].trim()}</p>
                                                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
                                                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{drugsResult.split('|||')[1].trim()}</p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, lineHeight: 1.8 }}>{drugsResult}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200, opacity: 0.15, gap: 12 }}>
                                                <Pill size={48} color="#fff" />
                                                <p style={{ color: '#fff', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Add Medicines Above</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Dermatology / Skin AI */}
                    {activeTab === 'derma' && (
                        <motion.div key="derma" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

                                {/* Upload Zone */}
                                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(236,72,153,0.2)', borderRadius: 28, padding: '2rem', backdropFilter: 'blur(20px)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
                                        <div style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(236,72,153,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Eye size={22} color="#ec4899" />
                                        </div>
                                        <div>
                                            <h3 style={{ color: '#fff', fontWeight: 900, fontSize: 20, margin: 0 }}>Skin AI Scanner</h3>
                                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', margin: 0 }}>CNN Trained on 10K+ Clinical Images</p>
                                        </div>
                                    </div>

                                    <label
                                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                        onDragLeave={() => setDragOver(false)}
                                        onDrop={(e) => { e.preventDefault(); setDragOver(false); analyzeSkin(e.dataTransfer.files[0]); }}
                                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 260, border: `2px dashed ${dragOver ? '#ec4899' : 'rgba(236,72,153,0.3)'}`, borderRadius: 20, cursor: 'pointer', background: dragOver ? 'rgba(236,72,153,0.1)' : 'rgba(236,72,153,0.04)', transition: 'all 0.3s', position: 'relative', overflow: 'hidden' }}>
                                        {isSkinLoading ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                                                <div style={{ width: 64, height: 64, borderRadius: '50%', border: '3px solid rgba(236,72,153,0.2)', borderTopColor: '#ec4899', animation: 'spin 1s linear infinite' }} />
                                                <p style={{ color: '#ec4899', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em' }}>CNN Analyzing...</p>
                                                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>Processing 10,015 pattern database</p>
                                            </div>
                                        ) : skinImage ? (
                                            <img src={skinImage} alt="skin" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7, borderRadius: 18 }} />
                                        ) : (
                                            <>
                                                <div style={{ width: 72, height: 72, borderRadius: 20, background: 'rgba(236,72,153,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                                                    <Microscope size={32} color="#ec4899" />
                                                </div>
                                                <p style={{ color: '#fff', fontWeight: 800, fontSize: 16, marginBottom: 8 }}>Drop Skin Image Here</p>
                                                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>or click to browse files</p>
                                                <div style={{ marginTop: 20, padding: '8px 20px', background: 'rgba(236,72,153,0.15)', borderRadius: 12, color: '#ec4899', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <Upload size={12} /> Upload Image
                                                </div>
                                            </>
                                        )}
                                        <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => analyzeSkin(e.target.files[0])} />
                                    </label>

                                    {skinImage && !isSkinLoading && (
                                        <button onClick={() => { setSkinImage(null); setSkinResult(null); }}
                                            style={{ marginTop: 12, width: '100%', padding: '10px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                                            Clear & Scan New Image
                                        </button>
                                    )}

                                    <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                        {['Melanocytic Nevi', 'Melanoma', 'Basal Cell', 'Dermatofibroma'].map((c, i) => (
                                            <div key={i} style={{ padding: '4px 12px', borderRadius: 100, background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.15)', color: '#ec4899', fontSize: 10, fontWeight: 700 }}>
                                                {c}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Results */}
                                <div style={{ background: 'rgba(0,0,0,0.5)', borderRadius: 28, padding: '2rem', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.5rem' }}>
                                        <Dna size={16} color="#ec4899" />
                                        <span style={{ color: '#ec4899', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Dermatology AI Report</span>
                                    </div>

                                    {skinResult ? skinResult.error ? (
                                        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 16, padding: '1rem' }}>
                                            <p style={{ color: '#ef4444', fontSize: 13, fontWeight: 700 }}>⚠️ {skinResult.error}</p>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                            <div style={{ background: `rgba(${skinResult.risk === 'High' ? '239,68,68' : skinResult.risk === 'Medium' ? '245,158,11' : '16,185,129'},0.1)`, border: `1px solid rgba(${skinResult.risk === 'High' ? '239,68,68' : skinResult.risk === 'Medium' ? '245,158,11' : '16,185,129'},0.3)`, borderRadius: 20, padding: '1.5rem', textAlign: 'center' }}>
                                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>Detected Condition</p>
                                                <p style={{ color: '#fff', fontSize: 24, fontWeight: 900, marginBottom: 8 }}>{skinResult.condition}</p>
                                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 16px', borderRadius: 100, background: 'rgba(255,255,255,0.1)' }}>
                                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: riskColors[skinResult.risk] }} />
                                                    <span style={{ color: riskColors[skinResult.risk], fontSize: 11, fontWeight: 800 }}>{skinResult.risk} Risk</span>
                                                </div>
                                            </div>

                                            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: '1.25rem' }}>
                                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 12 }}>AI Confidence Score</p>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                    <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 100, overflow: 'hidden' }}>
                                                        <motion.div initial={{ width: 0 }} animate={{ width: `${skinResult.confidence}%` }} transition={{ duration: 1, delay: 0.3 }}
                                                            style={{ height: '100%', background: 'linear-gradient(90deg, #ec4899, #6366f1)', borderRadius: 100 }} />
                                                    </div>
                                                    <span style={{ color: '#fff', fontWeight: 900, fontSize: 18 }}>{skinResult.confidence}%</span>
                                                </div>
                                            </div>

                                            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
                                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Recommendations</p>
                                                {['Consult a certified dermatologist', 'Avoid direct sun exposure on affected area', 'Do not self-medicate based on AI results'].map((r, i) => (
                                                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                                        <CheckCircle size={14} color="#10b981" style={{ marginTop: 2, flexShrink: 0 }} />
                                                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, lineHeight: 1.5 }}>{r}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                                                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>⚕️ This is an AI screening tool only. Not a medical diagnosis. Consult a licensed physician.</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.15, gap: 12, minHeight: 300 }}>
                                            <Eye size={64} color="#fff" />
                                            <p style={{ color: '#fff', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.3em', textAlign: 'center' }}>Upload a skin image to begin analysis</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
            `}</style>
        </div>
    );
};

export default AIHealthPage;
