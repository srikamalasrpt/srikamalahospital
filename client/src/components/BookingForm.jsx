import React, { useState } from 'react';
import { Calendar, User, Phone, Clipboard, Heart, Send, CheckCircle2, ChevronRight, Activity, Clock, ShieldCheck, Zap, Plus, Scissors, Syringe, Droplets } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { bookAppointment, getConfig } from '../utils/api';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: '',
    gender: 'మగ (Male)',
    department: 'జనరల్ మెడిసిన్ (General)',
    date: '',
    reason: '',
    paymentMethod: 'ఆసుపత్రిలో చెల్లించండి',
    image: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [allowOnlinePayment, setAllowOnlinePayment] = useState(true);

  React.useEffect(() => {
    getConfig().then(resp => {
      if (resp.data.success) {
        setAllowOnlinePayment(resp.data.config.allowOnlinePayment ?? true);
      }
    });
  }, []);

  const departments = [
    { en: 'General Medicine', te: 'జనరల్ మెడిసిన్' },
    { en: 'Cardiology', te: 'కార్డియాలజీ' },
    { en: 'Neurology', te: 'న్యూరాలజీ' },
    { en: 'Pediatrics', te: 'పీడియాట్రిక్స్' },
    { en: 'Orthopedics', te: 'ఆర్థోపెడిక్స్' },
    { en: 'Dermatology', te: 'డెర్మటాలజీ' }
  ];

  const handleAiPrefill = async () => {
    if (!aiInput) return;
    setIsAiLoading(true);
    try {
        const { chatWithAI } = await import('../utils/api');
        const deptStr = departments.map(d => `${d.en} (${d.te})`).join(', ');
        const prompt = `Symptoms: "${aiInput}". Which department from [${deptStr}] is best? Output JSON exactly and ONLY: {"department": "Exact format from list", "reason": "Professional 3-4 word reason for visit"}`;
        
        const resp = await chatWithAI(prompt);
        let parsed;
        try {
            parsed = JSON.parse(resp.data.response.replace(/```json|```/g, '').trim());
            if (parsed.department && parsed.reason) {
                setFormData(prev => ({ ...prev, department: parsed.department, reason: parsed.reason }));
            }
        } catch(e) {}
    } catch (err) {
        console.error(err);
    } finally {
        setIsAiLoading(false);
        setAiInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await bookAppointment(formData);
      if (response.data.success) {
         const serverToken = response.data.token;
         window.location.href = `/receipt?token=${serverToken}&status=offline`;
      }
    } catch (err) {
      console.error(err);
      alert('Error during booking. బహుశా నెట్‌వర్క్ సమస్య.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking" className="py-24 px-6 flex items-center justify-center bg-black relative overflow-hidden">
      
      {/* Background Decor Matrices */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[10%] left-[10%] w-[600px] h-[600px] bg-hospital-primary/10 rounded-full blur-[140px] animate-pulse-soft"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-hospital-secondary/5 rounded-full blur-[120px] animate-pulse-soft" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        
        {/* Token Animation Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-14 p-8 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between gap-8 group overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 p-10 opacity-[0.05] group-hover:rotate-12 transition-transform duration-1000"><Zap size={120} /></div>
          <div className="relative z-10 text-center md:text-left">
            <p className="text-[11px] font-black uppercase tracking-[0.5em] text-hospital-primary mb-2 italic">Active Booking Node v3.0</p>
            <p className="text-xl font-black text-white leading-tight">Digital token orchestration is active during session validation.</p>
          </div>
          <motion.div animate={{ rotateY: 360, rotateZ: 5 }} transition={{ repeat: Infinity, duration: 6, ease: 'linear' }} className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-hospital-secondary shadow-4xl border border-white/10">
            <Heart size={28} className="animate-pulse" />
          </motion.div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-20 items-center">
            
            <div className="lg:w-1/2 space-y-12">
                <div className="flex items-center gap-4 justify-center lg:justify-start">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-hospital-secondary shadow-4xl"><Calendar size={24} /></div>
                    <div>
                        <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-hospital-primary leading-none">Global Consultation Registry</h4>
                        <p className="text-[8px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-1 italic">Verified Institutional Booking Infrastructure</p>
                    </div>
                </div>

                <h2 className="text-3xl lg:text-6xl font-black text-white leading-[0.85] tracking-tighter font-['Noto_Sans_Telugu'] mb-6">
                  త్వరిత <span className="text-hospital-secondary italic font-serif">అపాయింట్‌మెంట్</span> <br/>బుకింగ్.
                </h2>
                <p className="text-[9px] uppercase font-bold text-gray-700 tracking-[0.8em] mt-2 mb-8 italic">SRI KAMALA PRECISION SCHEDULING UNIT</p>
                
                <div className="space-y-6">
                   {[
                     { icon: <Clock size={20}/>, title: 'తక్కువ సమయం', en: 'RAPID SLOT DEPLOYMENT', text: 'Confirm clinical access in under 60 seconds with institutional bypass.' },
                     { icon: <Activity size={20}/>, title: 'లైవ్ ట్రాకింగ్', en: 'LIVE QUEUE TELEMETRY', text: 'Monitor surgical and clinical queue priority via secure digital matrix.' }
                   ].map((item, i) => (
                      <div key={i} className="flex gap-6 items-start p-8 rounded-[40px] bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all group backdrop-blur-3xl active:scale-95 cursor-pointer">
                         <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-hospital-primary border border-white/10 shadow-inner group-hover:scale-110 transition-transform">{item.icon}</div>
                         <div>
                            <h4 className="font-black text-2xl text-white leading-none font-['Noto_Sans_Telugu'] mb-2">{item.title}</h4>
                            <p className="text-[10px] font-black text-hospital-secondary uppercase tracking-[0.3em] mb-2 italic opacity-70">{item.en}</p>
                            <p className="text-[14px] font-medium text-gray-500 leading-relaxed font-serif italic">"{item.text}"</p>
                         </div>
                      </div>
                   ))}
                </div>
                 
                 <div className="mt-10 bg-[#0a0a0a] border border-white/10 text-white p-10 rounded-[40px] shadow-4xl relative overflow-hidden group backdrop-blur-3xl">
                     <div className="absolute top-0 right-0 p-6 text-hospital-primary opacity-10 group-hover:scale-125 transition-transform duration-1000"><Activity size={100}/></div>
                     <p className="text-[9px] font-black uppercase tracking-[0.5em] mb-3 text-hospital-primary opacity-70 italic">AI Clinical Auto-Pilot v3.6</p>
                     <h4 className="text-[11px] font-black mb-5 uppercase tracking-widest text-white/60 italic leading-none">Autonomous Department Pathfinding</h4>
                     <div className="flex flex-col gap-4 relative z-10">
                         <input value={aiInput} onChange={e => setAiInput(e.target.value)} type="text" placeholder="Describe symptoms (e.g. chest pain, skin rash)..." 
                            className="bg-white/5 border border-white/10 p-5 rounded-2xl text-[11px] text-white outline-none focus:ring-2 ring-hospital-primary/30 transition-all font-bold placeholder:text-gray-700" />
                         <button type="button" onClick={handleAiPrefill} disabled={isAiLoading} className="animated-button group/ai bg-white text-black w-full p-5 rounded-[26px] flex items-center justify-center font-black text-[10px] uppercase tracking-[0.4em] hover:bg-hospital-primary transition-all disabled:opacity-50 gap-3 shadow-4xl relative overflow-hidden">
                            <span className="relative z-10 flex items-center gap-2 italic">{isAiLoading ? "Processing Case Node..." : <><Activity size={16} className="text-black group-hover/ai:animate-pulse"/> Deploy Logic Path</>}</span>
                            <div className="absolute inset-0 bg-hospital-primary opacity-0 group-hover/ai:opacity-100 transition-opacity"></div>
                         </button>
                     </div>
                 </div>
            </div>

            <div className="lg:w-1/2 w-full">
                <motion.form 
                    initial={{ perspective: 1000, rotateY: 5, opacity: 0 }}
                    whileInView={{ rotateY: 0, opacity: 1 }}
                    whileHover={{ rotateY: -1, rotateX: 1 }}
                    transition={{ type: 'spring', stiffness: 100, duration: 1 }}
                    onSubmit={handleSubmit} 
                    className="bg-white/5 backdrop-blur-3xl border border-white/10 p-10 lg:p-14 rounded-[60px] shadow-4xl relative overflow-hidden group">
                    
                    <div className="absolute top-0 right-0 w-40 h-40 bg-hospital-primary/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-3">
                            <label className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500 ml-2 font-['Noto_Sans_Telugu'] text-xs opacity-60 italic">పేరు (Patient Name)</label>
                            <div className="relative">
                                <User size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-hospital-primary/40 group-focus-within:text-hospital-primary transition-colors z-10" />
                                <input required type="text" placeholder="Institutional Payload ID..." value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 focus:border-hospital-primary/30 p-5 pl-14 rounded-2xl transition-all outline-none text-base font-bold text-white placeholder:text-gray-700" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500 ml-2 font-['Noto_Sans_Telugu'] text-xs opacity-60 italic">ఫోన్ నంబర్ (Phone Number)</label>
                            <div className="relative">
                                <Phone size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-hospital-primary/40 group-focus-within:text-hospital-secondary transition-colors z-10" />
                                <input required type="tel" placeholder="+91 0000 0000..." value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 focus:border-hospital-secondary/30 p-5 pl-14 rounded-2xl transition-all outline-none text-base font-bold text-white placeholder:text-gray-700" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500 ml-2 font-['Noto_Sans_Telugu'] text-xs opacity-60 italic">వయస్సు (Age)</label>
                            <input required type="number" placeholder="Cycle Count..." value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 focus:border-hospital-primary/30 p-5 rounded-2xl transition-all outline-none text-base font-bold text-white placeholder:text-gray-700" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500 ml-2 font-['Noto_Sans_Telugu'] text-xs opacity-60 italic">లింగం (Gender)</label>
                            <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 focus:border-hospital-primary/30 p-5 rounded-2xl transition-all outline-none text-base font-bold text-white cursor-pointer appearance-none">
                                <option className="bg-[#050505]">మగ (Male)</option><option className="bg-[#050505]">ఆడ (Female)</option><option className="bg-[#050505]">ఇతర (Other)</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-3 mb-8">
                        <label className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500 ml-2 font-['Noto_Sans_Telugu'] text-xs opacity-60 italic">విభాగం (Specialization)</label>
                        <select value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 focus:border-hospital-primary/30 p-5 rounded-2xl transition-all outline-none text-base font-bold text-white cursor-pointer appearance-none">
                            {departments.map(d => <option key={d.en} value={`${d.en} (${d.te})`} className="bg-[#050505]">{d.te} ({d.en})</option>)}
                        </select>
                    </div>

                    {formData.reason && (
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-3 mb-8 p-6 bg-hospital-primary/5 border border-hospital-primary/20 rounded-3xl backdrop-blur-3xl font-serif italic">
                          <label className="text-[10px] font-black uppercase tracking-[0.5em] text-hospital-primary ml-1 text-xs leading-none">AI CLINICAL LOGIC REASON</label>
                          <p className="font-bold text-sm text-white pl-1 mt-2">"{formData.reason}"</p>
                      </motion.div>
                    )}

                    <div className="space-y-4 mb-10">
                        <label className="text-[11px] font-black uppercase tracking-[0.4em] text-hospital-secondary ml-2 font-['Noto_Sans_Telugu'] text-xs flex items-center gap-3 italic">
                           <Activity size={18}/> <span>వైద్య చిత్రం (Clinical Case Photo - Optional)</span>
                        </label>
                        <div className="relative group">
                           <div className={`w-full h-40 rounded-[40px] border border-white/10 border-dashed transition-all duration-700 flex flex-col items-center justify-center gap-4 bg-white/5 cursor-pointer overflow-hidden ${formData.image ? 'border-hospital-primary' : 'hover:border-hospital-primary/40 hover:bg-white/10'}`}>
                              {formData.image ? (
                                 <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={formData.image} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" alt="Clinical imagery Node" />
                              ) : (
                                 <>
                                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-gray-700 border border-white/10 shadow-4xl group-hover:scale-110 transition-transform"><Plus size={28}/></div>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] italic group-hover:text-white transition-colors">INITIATE CASE FILE UPLOAD</p>
                                 </>
                              )}
                              <input type="file" accept="image/*" onChange={(e) => {
                                 const file = e.target.files[0];
                                 if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => setFormData({...formData, image: reader.result});
                                    reader.readAsDataURL(file);
                                 }
                              }} className="absolute inset-0 opacity-0 cursor-pointer" />
                           </div>
                        </div>
                    </div>

                    <div className="space-y-4 mb-12">
                        <label className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-500 ml-2 font-['Noto_Sans_Telugu'] text-xs opacity-60 italic">చెల్లింపు విధానం (Payment Protocol)</label>
                        <div className={`grid ${allowOnlinePayment ? 'grid-cols-2' : 'grid-cols-1'} gap-5`}>
                           {['Online', 'ఆసుపత్రిలో'].filter(m => allowOnlinePayment || m !== 'Online').map(m => (
                               <button key={m} type="button" onClick={() => setFormData({...formData, paymentMethod: m})}
                                  className={`p-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.5em] border transition-all active:scale-95 ${formData.paymentMethod === m ? 'border-hospital-primary bg-hospital-primary text-black shadow-neon-primary' : 'border-white/10 text-gray-600 hover:border-white/20 hover:text-white'}`}>
                                  {m === 'Online' ? 'Secure Link' : 'Node Entry (Counter)'}
                               </button>
                           ))}
                        </div>
                    </div>

                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit" disabled={isSubmitting}
                        className="animated-button group/final w-full bg-white text-black p-6 rounded-[28px] font-black text-[11px] uppercase tracking-[0.4em] shadow-4xl hover:bg-hospital-primary transition-all disabled:opacity-50 flex items-center justify-center gap-4 border-none relative overflow-hidden">
                        <span className="relative z-10 flex items-center gap-3 italic">
                          {isSubmitting ? "Orchestrating Case..." : <><span className="font-['Noto_Sans_Telugu'] text-xl tracking-tight leading-none">బుకింగ్ ఖరారు చేయండి</span> <ShieldCheck size={24} className="group-hover/final:animate-pulse"/></>}
                        </span>
                        <div className="absolute inset-0 bg-hospital-primary opacity-0 group-hover/final:opacity-100 transition-opacity"></div>
                    </motion.button>
                </motion.form>
                <div className="mt-8 text-center text-[9px] font-black text-gray-700 uppercase tracking-[0.6em] italic">Institutional Triage Protocol v3.0 // Authorized Access Only</div>
            </div>
        </div>
      </div>

       {/* Local Background Decor */}
       <div className="absolute top-1/2 left-[-5%] opacity-[0.02] text-white rotate-12 pointer-events-none"><Scissors size={200} /></div>
       <div className="absolute bottom-1/4 right-[5%] opacity-[0.02] text-hospital-secondary -rotate-12 pointer-events-none"><Syringe size={180} /></div>
       <div className="absolute top-1/4 left-1/2 -translate-x-1/2 opacity-[0.01] text-white pointer-events-none"><Plus size={400} /></div>

    </section>
  );
};

export default BookingForm;
