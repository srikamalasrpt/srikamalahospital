import React, { useState } from 'react';
import { Calendar, User, Phone, Clipboard, Heart, Send, CheckCircle2, ChevronRight, Activity, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { bookAppointment } from '../utils/api';

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
    <section id="booking" className="py-20 px-6 flex items-center justify-center bg-white relative">
      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-10 p-6 bg-gradient-to-r from-hospital-dark to-hospital-primary rounded-[30px] text-white flex items-center justify-between"
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] font-black opacity-70">3D Booking Animation</p>
            <p className="text-sm font-bold">Token animation is active while confirming OP booking.</p>
          </div>
          <motion.div animate={{ rotateY: 360 }} transition={{ repeat: Infinity, duration: 4, ease: 'linear' }} className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <Heart size={18} />
          </motion.div>
        </motion.div>
        <div className="flex flex-col lg:flex-row gap-16 items-center">
            
            <div className="lg:w-1/2 space-y-8">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-hospital-secondary flex items-center justify-center text-white shadow-lg"><Calendar size={16} /></div>
                    <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-hospital-primary">Appointment Portal</h4>
                </div>
                <h2 className="text-4xl lg:text-5xl font-black text-hospital-dark leading-none font-['Noto_Sans_Telugu']">
                  త్వరిత <span className="text-hospital-secondary italic underline decoration-hospital-secondary/20 underline-offset-8">అపాయింట్‌మెంట్</span> <br/>బుకింగ్.
                </h2>
                <p className="text-[10px] uppercase font-bold text-gray-300 tracking-widest">Fastest Consultation Booking Engine</p>
                
                <div className="space-y-4">
                   {[
                     { icon: <Clock size={16}/>, title: 'తక్కువ సమయం', en: 'Zero Wait Policy', text: 'Confirm your slot in under 60 seconds.' },
                     { icon: <Activity size={16}/>, title: 'లైవ్ ట్రాకింగ్', en: 'Live Queue Tracking', text: 'Monitor your turn through our digital portal.' }
                   ].map((item, i) => (
                      <div key={i} className="flex gap-4 items-start p-6 rounded-[32px] bg-gray-50 border border-gray-100 hover:shadow-lg transition-all">
                         <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-hospital-primary shadow-sm shrink-0">{item.icon}</div>
                         <div>
                            <h4 className="font-black text-lg text-hospital-dark leading-none font-['Noto_Sans_Telugu'] mb-1">{item.title}</h4>
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.en}</p>
                            <p className="text-[11px] font-medium text-gray-400">{item.text}</p>
                         </div>
                      </div>
                   ))}
                </div>
                 
                 <div className="mt-8 bg-hospital-secondary text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4 text-white/5 opacity-40 group-hover:rotate-12 transition-transform"><Activity size={100}/></div>
                     <p className="text-[8px] font-black uppercase tracking-[0.3em] mb-3 text-hospital-primary">AI Auto-Pilot</p>
                     <h4 className="text-sm font-black mb-4">Unsure which doctor to select?</h4>
                     <div className="flex flex-col gap-3 relative z-10">
                         <input value={aiInput} onChange={e => setAiInput(e.target.value)} type="text" placeholder="Describe symptoms (e.g. chest pain, skin rash)..." 
                            className="bg-white/10 border-none p-4 rounded-2xl text-[10px] text-white outline-none focus:ring-2 ring-white/50 font-bold" />
                         <button type="button" onClick={handleAiPrefill} disabled={isAiLoading} className="bg-hospital-dark w-full p-4 rounded-xl flex items-center justify-center font-black text-[9px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50 gap-2">
                            {isAiLoading ? "Analyzing Symptoms..." : <><Activity size={14} className="text-hospital-secondary pulse-animation"/> Auto-Select Department</>}
                         </button>
                     </div>
                 </div>
            </div>

            <div className="lg:w-1/2 w-full">
                <motion.form 
                    initial={{ perspective: 1000, rotateY: 5, opacity: 0 }}
                    whileInView={{ rotateY: 0, opacity: 1 }}
                    whileHover={{ rotateY: -1, rotateX: 1, boxShadow: "0 50px 100px -20px rgba(0,0,0,0.2)" }}
                    transition={{ type: 'spring', stiffness: 100 }}
                    onSubmit={handleSubmit} 
                    className="bg-white border-2 border-gray-50 p-8 lg:p-12 rounded-[50px] shadow-2xl relative overflow-hidden group">
                    
                    <div className="absolute top-0 right-0 w-32 h-32 bg-hospital-primary/5 rounded-bl-full pointer-events-none"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#1e293b]/40 ml-1 font-['Noto_Sans_Telugu'] text-xs">పేరు (Patient Name)</label>
                            <div className="relative">
                                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-hospital-primary transition-colors" />
                                <input required type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-hospital-primary/20 focus:bg-white p-3.5 pl-11 rounded-xl transition-all outline-none text-sm font-bold" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#1e293b]/40 ml-1 font-['Noto_Sans_Telugu'] text-xs">ఫోన్ నంబర్ (Phone Number)</label>
                            <div className="relative">
                                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-hospital-primary transition-colors" />
                                <input required type="tel" placeholder="+91 0000 0000" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-hospital-primary/20 focus:bg-white p-3.5 pl-11 rounded-xl transition-all outline-none text-sm font-bold" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#1e293b]/40 ml-1 font-['Noto_Sans_Telugu'] text-xs">వయస్సు (Age)</label>
                            <input required type="number" placeholder="Age" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})}
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-hospital-primary/20 focus:bg-white p-3.5 rounded-xl transition-all outline-none text-sm font-bold" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#1e293b]/40 ml-1 font-['Noto_Sans_Telugu'] text-xs">లింగం (Gender)</label>
                            <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-hospital-primary/20 focus:bg-white p-3.5 rounded-xl transition-all outline-none text-sm font-bold">
                                <option>మగ (Male)</option><option>ఆడ (Female)</option><option>ఇతర (Other)</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2 mb-6">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#1e293b]/40 ml-1 font-['Noto_Sans_Telugu'] text-xs">విభాగం (Specialization)</label>
                        <select value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})}
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-hospital-primary/20 focus:bg-white p-3.5 rounded-xl transition-all outline-none text-sm font-bold text-hospital-dark">
                            {departments.map(d => <option key={d.en} value={`${d.en} (${d.te})`}>{d.te} ({d.en})</option>)}
                        </select>
                    </div>

                    {formData.reason && (
                        <div className="space-y-2 mb-6 p-4 bg-hospital-primary/5 border border-hospital-primary/20 rounded-2xl">
                            <label className="text-[10px] font-black uppercase tracking-widest text-hospital-primary ml-1 text-xs">AI Clinical Reason</label>
                            <p className="font-bold text-sm text-hospital-dark pl-1">{formData.reason}</p>
                        </div>
                    )}

                    <div className="space-y-2 mb-8">
                        <label className="text-[10px] font-black uppercase tracking-widest text-hospital-secondary sm:ml-1 font-['Noto_Sans_Telugu'] text-xs flex items-center gap-2">
                           <Activity size={14}/> <span>వైద్య చిత్రం (Clinical Image - Optional)</span>
                        </label>
                        <div className="relative group">
                           <div className={`w-full h-32 rounded-[32px] border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 bg-gray-50/50 cursor-pointer overflow-hidden ${formData.image ? 'border-green-400 bg-green-50/10' : 'border-gray-100 hover:border-hospital-primary/30'}`}>
                              {formData.image ? (
                                 <img src={formData.image} className="w-full h-full object-cover opacity-80" alt="Clinical Preview" />
                              ) : (
                                 <>
                                    <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-gray-300 shadow-sm"><Activity size={20}/></div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Tap to Upload Case Photo</p>
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

                    <div className="space-y-2 mb-8">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#1e293b]/40 ml-1 font-['Noto_Sans_Telugu'] text-xs">చెల్లింపు విధానం (Payment)</label>
                        <div className="grid grid-cols-2 gap-4">
                           {['Online', 'ఆసుపత్రిలో'].map(m => (
                               <button key={m} type="button" onClick={() => setFormData({...formData, paymentMethod: m})}
                                  className={`p-3 rounded-xl font-black text-[9px] uppercase tracking-widest border-2 transition-all ${formData.paymentMethod === m ? 'border-hospital-primary bg-hospital-primary/5 text-hospital-primary' : 'border-gray-50 text-gray-300 hover:border-gray-100'}`}>
                                  {m === 'Online' ? 'UPI / Cards' : 'At Counter'}
                               </button>
                           ))}
                        </div>
                    </div>

                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit" disabled={isSubmitting}
                        className="w-full bg-hospital-dark text-white p-6 rounded-[32px] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-hospital-primary transition-all disabled:opacity-50 flex items-center justify-center gap-3 border-none">
                        {isSubmitting ? '...' : <><span className="font-['Noto_Sans_Telugu'] text-xl tracking-normal">బుకింగ్ ఖరారు చేయండి</span> <span className="opacity-40">/ CONFIRM</span></>} 
                    </motion.button>
                </motion.form>
            </div>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;
