import React, { useState } from 'react';
import { Calendar, User, Phone, Clipboard, Heart, Send, CheckCircle2, ChevronRight, Activity, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { bookAppointment } from '../utils/api';
import axios from 'axios';

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
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departments = [
    { en: 'General Medicine', te: 'జనరల్ మెడిసిన్' },
    { en: 'Cardiology', te: 'కార్డియాలజీ' },
    { en: 'Neurology', te: 'న్యూరాలజీ' },
    { en: 'Pediatrics', te: 'పీడియాట్రిక్స్' },
    { en: 'Orthopedics', te: 'ఆర్థోపెడిక్స్' },
    { en: 'Dermatology', te: 'డెర్మటాలజీ' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = 'TKN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      const response = await bookAppointment({ ...formData, token });
      if (response.data.success) {
         window.location.href = `/receipt?token=${token}&status=offline`;
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
            </div>

            <div className="lg:w-1/2 w-full">
                <form onSubmit={handleSubmit} className="bg-white border-2 border-gray-50 p-8 lg:p-12 rounded-[50px] shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#1e293b]/40 ml-1 font-['Noto_Sans_Telugu'] text-xs">పేరు (Patient Name)</label>
                            <div className="relative">
                                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                <input required type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-gray-50 border border-transparent focus:border-hospital-primary focus:bg-white p-3.5 pl-11 rounded-xl transition-all outline-none text-sm font-bold" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#1e293b]/40 ml-1 font-['Noto_Sans_Telugu'] text-xs">ఫోన్ నంబర్ (Phone Number)</label>
                            <div className="relative">
                                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                <input required type="tel" placeholder="+91 0000 0000" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    className="w-full bg-gray-50 border border-transparent focus:border-hospital-primary focus:bg-white p-3.5 pl-11 rounded-xl transition-all outline-none text-sm font-bold" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#1e293b]/40 ml-1 font-['Noto_Sans_Telugu'] text-xs">వయస్సు (Age)</label>
                            <input required type="number" placeholder="Age" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})}
                                    className="w-full bg-gray-50 border border-transparent focus:border-hospital-primary focus:bg-white p-3.5 rounded-xl transition-all outline-none text-sm font-bold" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#1e293b]/40 ml-1 font-['Noto_Sans_Telugu'] text-xs">లింగం (Gender)</label>
                            <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}
                                    className="w-full bg-gray-50 border border-transparent focus:border-hospital-primary focus:bg-white p-3.5 rounded-xl transition-all outline-none text-sm font-bold">
                                <option>మగ (Male)</option><option>ఆడ (Female)</option><option>ఇతర (Other)</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2 mb-6">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#1e293b]/40 ml-1 font-['Noto_Sans_Telugu'] text-xs">విభాగం (Specialization)</label>
                        <select value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})}
                                className="w-full bg-gray-50 border border-transparent focus:border-hospital-primary focus:bg-white p-3.5 rounded-xl transition-all outline-none text-sm font-bold">
                            {departments.map(d => <option key={d.en} value={d.te}>{d.te} ({d.en})</option>)}
                        </select>
                    </div>

                    <div className="space-y-2 mb-8">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#1e293b]/40 ml-1 font-['Noto_Sans_Telugu'] text-xs">చెల్లింపు విధానం (Payment)</label>
                        <div className="grid grid-cols-2 gap-4">
                           {['Online', 'ఆసుపత్రిలో'].map(m => (
                               <button key={m} type="button" onClick={() => setFormData({...formData, paymentMethod: m})}
                                  className={`p-3 rounded-xl font-black text-[9px] uppercase tracking-widest border transition-all ${formData.paymentMethod === m ? 'border-hospital-primary bg-hospital-primary/5 text-hospital-primary' : 'border-gray-50 text-gray-300'}`}>
                                  {m === 'Online' ? 'UPI / Cards' : 'At Counter'}
                               </button>
                           ))}
                        </div>
                    </div>

                    <button type="submit" disabled={isSubmitting}
                        className="w-full bg-hospital-dark text-white p-6 rounded-[32px] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-hospital-primary transition-all disabled:opacity-50 flex items-center justify-center gap-3">
                        {isSubmitting ? '...' : <><span className="font-['Noto_Sans_Telugu'] text-xl tracking-normal">బుకింగ్ ఖరారు చేయండి</span> <span className="opacity-40">/ CONFIRM</span></>} 
                    </button>
                </form>
            </div>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;
