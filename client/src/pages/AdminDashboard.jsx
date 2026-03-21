import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Calendar, CheckCircle, Clock, Search, LogOut, ChevronRight, Download, Pill, Activity, Plus, Trash2, Settings, Globe, Lock, Key, Sparkles, Filter, MoreVertical, FileText, UserPlus, Phone, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { updateConfig, getConfig, adminLogin, fetchPharmacyProducts, getAppointments, updateAppointment, discoverMedicines, savePatientClinicalNote, getPatientClinicalHistory } from '../utils/api';

const AdminDashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    
    // Core Data
    const [appointments, setAppointments] = useState([]);
    const [products, setProducts] = useState([]);
    const [patients, setPatients] = useState([]); // Unique patients merged by phone/name
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [config, setConfig] = useState({ showCoreServices: true, hospitalPhone: '99480 76665', diagnosticsPhone: '9866895634' });

    // UI States
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activePatient, setActivePatient] = useState(null); // To view detailed history
    const [aiKeyword, setAiKeyword] = useState('');
    const [aiSuggestions, setAiSuggestions] = useState([]);
    const [aiNote, setAiNote] = useState('');
    const [aiMatchCount, setAiMatchCount] = useState(0);
    const [selectedMedicines, setSelectedMedicines] = useState([]);
    const [clinicalNotes, setClinicalNotes] = useState('');
    const [clinicalType, setClinicalType] = useState('General OP');
    const [patientClinicalHistory, setPatientClinicalHistory] = useState([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [auditResult, setAuditResult] = useState(null);

    useEffect(() => {
        if (isAuthenticated) {
            fetchData();
        }
    }, [isAuthenticated]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [aptResp, prodResp, confResp] = await Promise.all([
                getAppointments(),
                fetchPharmacyProducts(),
                getConfig()
            ]);
            
            if (aptResp.data.success) {
                const raw = aptResp.data.appointments;
                setAppointments(raw);
                
                // Merge Unique Patients Logic
                const patientMap = {};
                raw.forEach(a => {
                    const key = `${a.name.toLowerCase()}_${a.phone}`;
                    if (!patientMap[key]) {
                        patientMap[key] = {
                            name: a.name,
                            phone: a.phone,
                            age: a.age,
                            gender: a.gender,
                            token: a.token,
                            visits: [a]
                        };
                    } else {
                        patientMap[key].visits.push(a);
                    }
                });
                setPatients(Object.values(patientMap));
            }
            if (prodResp.data.success) setProducts(prodResp.data.products);
            if (confResp.data.success) setConfig(confResp.data.config);
        } catch (err) {
            console.error("Dashboard Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const resp = await adminLogin(password);
            if (resp.data.success) {
                setIsAuthenticated(true);
                setLoginError('');
            }
        } catch (err) {
            setLoginError('Invalid Administrator Password');
        }
    };

    const handleAiSearch = async (val) => {
        setAiKeyword(val);
        if (val.length > 2) {
            try {
                const resp = await discoverMedicines(val);
                if (resp.data.success) {
                    setAiSuggestions(resp.data.results);
                    setAiNote(resp.data.ai_note);
                    setAiMatchCount(resp.data.totalMatches || 0);
                }
            } catch (err) { console.error(err); }
        } else {
            setAiSuggestions([]);
            setAiNote('');
            setAiMatchCount(0);
        }
    };

    const addMedicineToPrescription = (name) => {
        setSelectedMedicines((prev) => {
            const existing = prev.find((m) => m.name === name);
            if (existing) return prev.map((m) => m.name === name ? { ...m, qty: m.qty + 1 } : m);
            return [...prev, { name, qty: 1 }];
        });
    };

    const updateMedicineQty = (name, qty) => {
        const q = Number(qty) || 1;
        setSelectedMedicines((prev) => prev.map((m) => m.name === name ? { ...m, qty: Math.max(1, q) } : m));
    };

    const removeMedicine = (name) => {
        setSelectedMedicines((prev) => prev.filter((m) => m.name !== name));
    };

    const loadClinicalHistory = async (patient) => {
        if (!patient) return;
        try {
            const resp = await getPatientClinicalHistory(patient.name, patient.phone);
            if (resp.data.success) setPatientClinicalHistory(resp.data.records || []);
        } catch (err) {
            console.error(err);
        }
    };

    const saveClinicalEntry = async () => {
        if (!activePatient) return;
        try {
            const payload = {
                token: activePatient.token,
                patientName: activePatient.name,
                phone: activePatient.phone,
                diagnosisType: clinicalType,
                notes: clinicalNotes,
                prescription: selectedMedicines
            };
            const resp = await savePatientClinicalNote(payload);
            if (resp.data.success) {
                setClinicalNotes('');
                setSelectedMedicines([]);
                setPatientClinicalHistory(resp.data.records || []);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const runClinicalAudit = async (imageUrl) => {
        if (!imageUrl) return;
        setIsAnalyzing(true);
        setAuditResult(null);
        try {
            const { analyzeVisionImage } = await import('../utils/api');
            const resp = await analyzeVisionImage(imageUrl, "Administrative Clinical Audit");
            if (resp.data.success) {
                setAuditResult(resp.data.analysis);
            }
        } catch (err) {
            console.error("Audit Error:", err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const updateAptStatus = async (id, status) => {
        try {
            await updateAppointment(id, status);
            fetchData();
        } catch (err) { console.error(err); }
    };

    if (!isAuthenticated) return (
        <div className="min-h-screen bg-hospital-dark flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-10 w-full max-w-sm bg-white/5 backdrop-blur-2xl p-10 rounded-[50px] border border-white/20 shadow-4xl text-center">
                <div className="w-20 h-20 mx-auto bg-hospital-primary rounded-3xl flex items-center justify-center shadow-xl mb-8 group cursor-pointer hover:rotate-12 transition-transform">
                    <Lock size={32} className="text-white" />
                </div>
                <h2 className="text-3xl font-black mb-2 tracking-tight">K-OS Admin</h2>
                <p className="text-[10px] font-black text-gray-400 tracking-[0.4em] uppercase mb-8 opacity-40">Sri Kamala Operating System</p>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Secure Handshake Key"
                        className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-hospital-primary/50 transition-all font-mono tracking-widest text-center" />
                    {loginError && <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest">{loginError}</p>}
                    <button className="w-full bg-hospital-primary text-white py-4 rounded-2xl font-black tracking-widest hover:bg-white hover:text-hospital-dark transition-all">AUTHENTICATE</button>
                </form>
            </motion.div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] flex font-sans text-hospital-dark overflow-hidden">
            {/* Navigation Rail */}
            <aside className={`bg-hospital-dark text-white flex flex-col transition-all duration-500 overflow-hidden ${isSidebarOpen ? 'w-80' : 'w-24'} relative z-30`}>
                <div className="p-8 flex items-center gap-4 border-b border-white/5 h-24">
                    <div className="w-12 h-12 bg-hospital-primary rounded-2xl shadow-xl flex items-center justify-center shrink-0"><LayoutDashboard size={24} /></div>
                    {isSidebarOpen && <h1 className="text-xl font-black tracking-tighter uppercase whitespace-nowrap">SRI KAMALA <span className="text-hospital-primary">HQ</span></h1>}
                </div>

                <nav className="p-6 space-y-3 flex-1 overflow-y-auto">
                    {[
                        { id: 'overview', icon: <Activity size={20}/>, label: 'Analytics' },
                        { id: 'appointments', icon: <Calendar size={20}/>, label: 'Booking Queue' },
                        { id: 'patients', icon: <Users size={20}/>, label: 'Patient Master' },
                        { id: 'medicines', icon: <Pill size={20}/>, label: 'Medicine Stocks' },
                        { id: 'settings', icon: <Settings size={20}/>, label: 'Cloud Config' }
                    ].map(item => (
                        <button key={item.id} onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-5 p-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-hospital-primary text-white shadow-2xl shadow-hospital-primary/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
                            <div className="shrink-0">{item.icon}</div>
                            {isSidebarOpen && <span>{item.label}</span>}
                        </button>
                    ))}
                </nav>

                <div className="p-6 border-t border-white/5">
                    <button onClick={() => setIsAuthenticated(false)} className="w-full flex items-center gap-5 p-4 rounded-2xl text-red-400 hover:bg-red-500/10 font-bold transition-all">
                        <LogOut size={20} />
                        {isSidebarOpen && <span className="uppercase text-[10px] tracking-widest">Seal Session</span>}
                    </button>
                </div>
            </aside>

            {/* Main Area */}
            <main className="flex-1 flex flex-col h-screen relative bg-white lg:rounded-l-[60px] shadow-inner overflow-hidden">
                <header className="h-24 px-12 flex justify-between items-center border-b border-gray-50 shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><MoreVertical size={20}/></button>
                        <h2 className="text-2xl font-black tracking-tight capitalize">{activeTab} Console</h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-hospital-primary transition-colors" />
                            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} type="text" placeholder="Search Master DB..."
                                className="bg-gray-50 border-none pl-12 pr-6 py-3 rounded-full text-xs font-bold outline-none ring-2 ring-transparent focus:ring-hospital-primary/10 transition-all w-64 md:w-96" />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-black uppercase text-gray-400 leading-none mb-1">Authenticated As</p>
                                <p className="text-sm font-black text-hospital-dark">Hospital Director</p>
                            </div>
                            <div className="w-12 h-12 bg-hospital-mint rounded-2xl border-2 border-white shadow-xl flex items-center justify-center text-hospital-primary"><Sparkles size={20}/></div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-12 bg-gray-50/50">
                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' && (
                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="space-y-12">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {[
                                        { l: 'Today Load', v: appointments.length, i: <Clock/>, c: 'text-blue-600', bg: 'bg-blue-50' },
                                        { l: 'Patient Count', v: patients.length, i: <Users/>, c: 'text-purple-600', bg: 'bg-purple-50' },
                                        { l: 'Stock Count', v: products.length, i: <Pill/>, c: 'text-orange-600', bg: 'bg-orange-50' },
                                        { l: 'Revenue Est', v: `₹${appointments.length * 200}`, i: <Sparkles/>, c: 'text-green-600', bg: 'bg-green-50' }
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100/50 hover:shadow-xl transition-all">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className={`w-14 h-14 ${stat.bg} ${stat.c} rounded-2xl flex items-center justify-center shadow-inner`}>{stat.i}</div>
                                                <ChevronRight size={16} className="text-gray-300" />
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.l}</p>
                                            <h3 className="text-4xl font-black text-hospital-dark tracking-tighter">{stat.v}</h3>
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="bg-hospital-dark p-12 rounded-[50px] shadow-4xl text-white relative overflow-hidden h-96">
                                        <div className="absolute top-0 right-0 p-12 text-white/5 opacity-20"><Activity size={200} /></div>
                                        <h3 className="text-2xl font-black mb-2">Hospital Health Index</h3>
                                        <p className="text-xs font-bold text-hospital-primary tracking-widest uppercase mb-12">System Live & Synchronized</p>
                                        <div className="space-y-8 relative z-10">
                                            <div className="space-y-3">
                                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest"><span>Supabase Uptime</span><span>99.9%</span></div>
                                                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="w-[99.9%] h-full bg-hospital-primary"></div></div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest"><span>Queue Efficiency</span><span>87/100</span></div>
                                                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="w-[87%] h-full bg-hospital-mint"></div></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-12 rounded-[50px] shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
                                       <div className="w-24 h-24 bg-hospital-primary/10 rounded-full flex items-center justify-center text-hospital-primary mb-6"><Users size={40}/></div>
                                       <h3 className="text-xl font-black text-hospital-dark mb-4">Active Staff Presence</h3>
                                       <div className="flex -space-x-4 mb-6">
                                          {[...Array(5)].map((_, i) => <div key={i} className="w-12 h-12 rounded-2xl bg-gray-200 border-4 border-white"></div>)}
                                          <div className="w-12 h-12 rounded-2xl bg-hospital-secondary text-white flex items-center justify-center text-xs font-black">+12</div>
                                       </div>
                                       <button className="text-[10px] font-black uppercase tracking-widest text-hospital-primary hover:underline">View Roster Matrix</button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'appointments' && (
                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-8">
                                <div className="bg-white rounded-[50px] shadow-sm border border-gray-100 p-8">
                                    <h3 className="text-xl font-black mb-8 flex items-center gap-3">Live Booking Stream <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div></h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-b border-gray-50">
                                                    <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Token ID</th>
                                                    <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Patient Identification</th>
                                                    <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Sector</th>
                                                    <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Verification</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {appointments.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase())).map((apt, i) => (
                                                    <tr key={apt._id || i} className="group hover:bg-gray-50 transition-colors">
                                                        <td className="py-6 px-4 font-mono font-black text-sm text-hospital-primary">{apt.token}</td>
                                                        <td className="py-6 px-4">
                                                            <p className="font-black text-hospital-dark">{apt.name}</p>
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{apt.phone} | {apt.age}y</p>
                                                        </td>
                                                        <td className="py-6 px-4">
                                                            <span className="px-3 py-1 bg-hospital-mint/30 text-hospital-primary text-[9px] font-black uppercase rounded-lg tracking-widest">{apt.department}</span>
                                                        </td>
                                                        <td className="py-6 px-4 text-right">
                                                            <button onClick={() => updateAptStatus(apt._id, 'Paid')}
                                                                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${apt.paymentStatus === 'Paid' ? 'bg-green-100 border-green-100 text-green-600' : 'bg-white border-gray-50 text-gray-400 hover:border-hospital-primary hover:text-hospital-secondary'}`}>
                                                                {apt.paymentStatus === 'Paid' ? 'Verified ✓' : 'Verify Entry'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'patients' && (
                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-white rounded-[50px] shadow-sm border border-gray-100 p-12 overflow-y-auto h-[70vh]">
                                        <h3 className="text-xl font-black mb-10 flex items-center justify-between">Patient Master File <div className="text-[10px] font-black bg-gray-100 px-3 py-1 rounded-full uppercase text-gray-400">{patients.length} Unique Records</div></h3>
                                        <div className="space-y-4">
                                            {patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map((p, i) => (
                                                <button key={i} onClick={() => { setActivePatient(p); loadClinicalHistory(p); }}
                                                    className={`w-full flex items-center justify-between p-6 rounded-[32px] border transition-all ${activePatient?.name === p.name ? 'border-hospital-primary bg-hospital-primary/5 shadow-lg' : 'border-gray-50 hover:border-hospital-primary/20 bg-white'}`}>
                                                    <div className="flex items-center gap-5 text-left">
                                                        <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 shadow-inner"><UserPlus size={24}/></div>
                                                        <div>
                                                            <h4 className="font-black text-hospital-dark">{p.name}</h4>
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{p.phone}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xl font-black text-hospital-dark leading-none">{p.visits.length}</p>
                                                        <p className="text-[8px] font-black uppercase text-gray-300 tracking-widest">Visits</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-hospital-dark rounded-[50px] shadow-4xl p-12 text-white flex flex-col items-center justify-center text-center relative overflow-hidden h-[70vh]">
                                        <AnimatePresence mode="wait">
                                            {activePatient ? (
                                                <motion.div key={activePatient.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full text-left space-y-12">
                                                    <div className="flex justify-between items-start w-full">
                                                        <div className="space-y-2">
                                                            <h3 className="text-4xl font-black tracking-tighter">{activePatient.name}</h3>
                                                            <p className="text-hospital-primary font-black uppercase text-xs tracking-widest">{activePatient.token}</p>
                                                            <div className="flex gap-4 mt-6">
                                                                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest">{activePatient.age}y</div>
                                                                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest">{activePatient.gender}</div>
                                                            </div>
                                                        </div>
                                                        <div className="w-24 h-24 bg-white/5 rounded-[40px] border border-white/10 flex items-center justify-center text-hospital-primary"><Sparkles size={40}/></div>
                                                    </div>
                                                    
                                                    <div className="space-y-6">
                                                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-hospital-primary pb-2 border-b border-white/10 flex justify-between">
                                                            <span>Clinical History Matrix</span>
                                                            {auditResult && <span className="text-hospital-mint flex items-center gap-1 animate-pulse"><Sparkles size={10}/> AI INSIGHT ATTACHED</span>}
                                                        </h4>
                                                        {auditResult && (
                                                            <div className="p-4 bg-hospital-secondary/5 rounded-2xl border border-hospital-secondary/20 space-y-3">
                                                                <p className="text-[9px] font-black text-hospital-secondary uppercase tracking-widest">AI Pre-Screening Result</p>
                                                                <p className="text-xs font-bold text-white/80">{auditResult.condition?.en}</p>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {auditResult.precautions?.map((p, i) => <span key={i} className="text-[8px] bg-white/5 px-2 py-1 rounded-md text-white/50">{p.en}</span>)}
                                                                </div>
                                                                <button onClick={() => setAuditResult(null)} className="text-[8px] text-white/20 hover:text-white transition-colors">Clear Result</button>
                                                            </div>
                                                        )}
                                                        <div className="space-y-4 h-64 overflow-y-auto pr-4 scrollbar-hide">
                                                            {activePatient.visits.map((v, i) => (
                                                                <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-between group hover:bg-white/10 transition-all">
                                                                    <div className="flex items-center gap-4 flex-1">
                                                                        <div className="w-10 h-10 bg-hospital-primary/20 rounded-xl flex items-center justify-center text-hospital-primary overflow-hidden">
                                                                            {v.image ? <img src={v.image} className="w-full h-full object-cover" /> : <Activity size={18}/>}
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-black text-sm">{v.department}</p>
                                                                            <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{v.appointmentDate}</p>
                                                                        </div>
                                                                    </div>
                                                                    {v.image && (
                                                                        <button onClick={() => runClinicalAudit(v.image)} disabled={isAnalyzing}
                                                                            className="px-3 py-1 bg-hospital-secondary text-white text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50">
                                                                            {isAnalyzing ? <div className="w-2 h-2 rounded-full bg-white animate-ping"></div> : <Sparkles size={12}/>}  Audit
                                                                        </button>
                                                                    )}
                                                                    <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity text-hospital-secondary"><Download size={16}/></button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <select value={clinicalType} onChange={(e) => setClinicalType(e.target.value)} className="bg-white/10 border border-white/10 rounded-2xl p-3 text-xs font-bold outline-none">
                                                                <option>General OP</option>
                                                                <option>Diagnostics</option>
                                                                <option>Follow-up</option>
                                                            </select>
                                                            <input value={clinicalNotes} onChange={(e) => setClinicalNotes(e.target.value)} placeholder="Clinical notes / findings"
                                                                className="bg-white/10 border border-white/10 rounded-2xl p-3 text-xs font-bold outline-none placeholder:text-white/40" />
                                                        </div>
                                                        <div className="space-y-2 max-h-28 overflow-y-auto">
                                                            {selectedMedicines.map((med) => (
                                                                <div key={med.name} className="flex items-center gap-3">
                                                                    <p className="text-xs font-bold flex-1">{med.name}</p>
                                                                    <input type="number" min="1" value={med.qty} onChange={(e) => updateMedicineQty(med.name, e.target.value)} className="w-16 bg-white/10 border border-white/10 rounded-lg p-1 text-xs" />
                                                                    <button onClick={() => removeMedicine(med.name)} className="text-red-300"><Trash2 size={14} /></button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <button onClick={saveClinicalEntry} className="w-full bg-white text-hospital-dark py-4 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-hospital-primary hover:text-white transition-all">Save Clinical Prescription</button>
                                                        <div className="text-left">
                                                            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Saved Clinical History</p>
                                                            <div className="space-y-2 max-h-28 overflow-y-auto">
                                                                {patientClinicalHistory.map((entry, idx) => (
                                                                    <div key={idx} className="p-3 bg-white/5 rounded-xl border border-white/10 text-[10px]">
                                                                        <p className="font-black">{entry.diagnosisType} | {entry.token}</p>
                                                                        <p className="opacity-70">{entry.notes || 'No notes'}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <div className="space-y-6">
                                                    <div className="w-32 h-32 mx-auto bg-white/5 rounded-[50px] border border-white/10 flex items-center justify-center text-white/10"><FileText size={60}/></div>
                                                    <p className="text-xs uppercase font-black tracking-[0.4em] text-white/20">Select a patient for history insight</p>
                                                </div>
                                            )}
                                        </AnimatePresence>
                                        <div className="absolute top-0 right-0 p-8 text-white/5 pointer-events-none"><Sparkles size={200}/></div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'medicines' && (
                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-12">
                                <div className="bg-hospital-dark p-16 rounded-[60px] text-white relative overflow-hidden">
                                     <div className="absolute top-0 right-0 w-96 h-96 bg-hospital-secondary opacity-5 rounded-full blur-[100px]"></div>
                                     <h3 className="text-3xl font-black mb-4 relative z-10">AI Medicine Discovery</h3>
                                     <p className="text-xs font-black text-hospital-primary tracking-[0.3em] uppercase mb-12 relative z-10">Clinical Stock Intelligent Selection</p>
                                     <div className="relative z-10 max-w-2xl">
                                        <div className="relative mb-8">
                                            <Sparkles size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-hospital-primary" />
                                            <input value={aiKeyword} onChange={(e) => handleAiSearch(e.target.value)} type="text" placeholder="Type clinical keyword (e.g. 'injection', 'paracetamol')..."
                                                className="w-full bg-white/5 border-2 border-white/10 focus:border-hospital-primary p-6 pl-14 rounded-3xl text-lg font-bold outline-none transition-all placeholder:text-white/20" />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-hospital-mint mb-4">Matches Found: {aiMatchCount}</p>
                                        <AnimatePresence>
                                            {aiSuggestions.length > 0 && (
                                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                                    className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {aiSuggestions.map((med, i) => (
                                                        <div key={i} className="p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 flex items-center justify-between group hover:bg-hospital-primary transition-all cursor-pointer">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-hospital-primary group-hover:bg-white group-hover:text-hospital-primary transition-colors"><Pill size={18}/></div>
                                                                <p className="font-black text-sm">{med}</p>
                                                            </div>
                                                            <button onClick={() => addMedicineToPrescription(med)} className="text-white/30 group-hover:text-white"><Plus size={18}/></button>
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        {aiNote && <p className="mt-8 text-[10px] font-black uppercase tracking-widest text-hospital-mint italic opacity-60">AI: {aiNote}</p>}
                                        {selectedMedicines.length > 0 && (
                                            <div className="mt-6 p-5 bg-white/5 rounded-2xl border border-white/10">
                                                <p className="text-[10px] uppercase tracking-widest font-black text-white/60 mb-3">Prescription Builder</p>
                                                <div className="space-y-2">
                                                    {selectedMedicines.map((med) => (
                                                        <div key={med.name} className="flex items-center justify-between text-xs">
                                                            <span>{med.name}</span>
                                                            <span className="font-black">Qty: {med.qty}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="bg-white rounded-[50px] shadow-sm border border-gray-100 p-12">
                                     <h3 className="text-xl font-black mb-10">Pharmacy Inventory Master</h3>
                                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                         {products.map((p, i) => (
                                             <div key={i} className="p-8 bg-gray-50 rounded-[40px] border border-gray-100 hover:shadow-xl transition-all group">
                                                 <div className="flex justify-between items-start mb-6">
                                                     <div className="w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center text-hospital-secondary group-hover:scale-110 transition-transform"><Pill size={32}/></div>
                                                     <div className="px-3 py-1 bg-white border border-gray-100 rounded-full text-[8px] font-black uppercase tracking-widest">{p.category}</div>
                                                 </div>
                                                 <h4 className="text-lg font-black text-hospital-dark mb-1">{p.name}</h4>
                                                 <p className="text-2xl font-black text-hospital-primary mb-6">₹{p.price}</p>
                                                 <button className="w-full py-4 bg-hospital-dark text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-hospital-primary transition-colors">Adjust Stock</button>
                                             </div>
                                         ))}
                                     </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'settings' && (
                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-4xl space-y-12 pb-20">
                                <div className="bg-white p-12 rounded-[60px] shadow-sm border border-gray-100">
                                    <h3 className="text-2xl font-black mb-10 flex items-center gap-4"><Settings size={28} className="text-hospital-secondary"/> Platform Configuration</h3>
                                    
                                    <div className="space-y-12">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 leading-none">Hospital Primary Phone</label>
                                                <div className="relative">
                                                    <Phone size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-hospital-primary" />
                                                    <input value={config.hospitalPhone} onChange={(e) => setConfig({...config, hospitalPhone: e.target.value})} type="text"
                                                        className="w-full bg-gray-50 border-none p-5 pl-16 rounded-3xl font-black text-sm outline-none focus:ring-2 ring-hospital-primary/10 transition-all" />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 leading-none">Lab/Diagnostics Phone</label>
                                                <div className="relative">
                                                    <Sparkles size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-hospital-primary" />
                                                    <input value={config.diagnosticsPhone} onChange={(e) => setConfig({...config, diagnosticsPhone: e.target.value})} type="text"
                                                        className="w-full bg-gray-50 border-none p-5 pl-16 rounded-3xl font-black text-sm outline-none focus:ring-2 ring-hospital-primary/10 transition-all" />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="p-10 bg-[#fefefe] rounded-[40px] border-2 border-gray-50 shadow-sm flex items-center justify-between">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 bg-hospital-mint flex items-center justify-center text-hospital-primary rounded-3xl shadow-inner"><Globe size={28}/></div>
                                                <div>
                                                    <p className="font-black text-hospital-dark text-lg">Landing Page Core Services</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Live Visibility Toggle</p>
                                                </div>
                                            </div>
                                            <button onClick={async () => {
                                                const payload = { ...config, showCoreServices: !config.showCoreServices };
                                                await updateConfig(payload);
                                                setConfig(payload);
                                            }} className={`w-20 h-10 rounded-full p-1 transition-colors relative ${config.showCoreServices ? 'bg-hospital-primary' : 'bg-gray-200'}`}>
                                                <div className={`w-8 h-8 bg-white rounded-full shadow-xl transition-all absolute top-1 ${config.showCoreServices ? 'right-1' : 'left-1'}`}></div>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <button onClick={() => updateConfig(config)} className="mt-12 w-full bg-hospital-dark text-white p-7 rounded-[32px] font-black text-xs uppercase tracking-[0.4em] shadow-4xl hover:bg-hospital-primary transition-all">PUBLISH CLOUD CONFIG CHANGES</button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
