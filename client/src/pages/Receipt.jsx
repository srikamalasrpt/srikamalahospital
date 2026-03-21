import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Hospital, Download, Heart, ArrowLeft, Calendar, FileText, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAppointments } from '../utils/api';

const Receipt = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const orderId = searchParams.get('order_id');
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchAppointment();
    }
  }, [token]);

  const fetchAppointment = async () => {
    try {
      const resp = await getAppointments();
      if (resp.data.success) {
        const found = resp.data.appointments.find(a => a.token === token);
        setAppointment(found);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isPaid = appointment?.paymentStatus === 'Paid';

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-hospital-background">
    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} 
      className="w-16 h-16 border-4 border-hospital-primary/30 border-t-hospital-primary rounded-full shadow-xl" />
  </div>;

  return (
    <div className="min-h-screen bg-hospital-background p-6 md:p-12 font-sans flex flex-col items-center">
      <header className="w-full max-w-2xl flex items-center justify-between mb-8">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-hospital-dark font-black hover:text-hospital-secondary transition-all group">
           <div className="p-2 bg-white rounded-xl shadow-md border border-gray-50 group-hover:-translate-x-1 transition-transform">
             <ArrowLeft size={18} />
           </div>
           Back to Home
        </button>
        <button className="p-3 bg-white text-hospital-primary rounded-xl shadow-lg border border-gray-50 hover:scale-105 active:scale-95 transition-all">
           <Download size={22} />
        </button>
      </header>

      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl bg-white rounded-[40px] shadow-2xl border-2 border-white relative overflow-hidden">
        
        {/* Ribbon Status */}
        <div className={`absolute top-10 -right-16 w-64 py-2 rotate-45 text-center text-white font-black uppercase tracking-widest shadow-xl z-20 ${isPaid ? 'bg-green-500' : 'bg-orange-500'}`}>
           {isPaid ? 'Payment Received' : 'Pay at Counter'}
        </div>

        {/* Receipt Header */}
        <div className="p-10 border-b-2 border-dashed border-gray-100 flex items-center justify-between relative bg-gray-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-hospital-primary rounded-2xl shadow-xl">
                 <Hospital size={40} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-hospital-dark leading-none font-['Noto_Sans_Telugu']">శ్రీ కమల <span className="text-hospital-primary">హాస్పిటల్</span></h1>
                <p className="text-[7px] uppercase font-black text-gray-400 tracking-[0.4em] mt-1">SRI KAMALA HOSPITAL | SURYAPET</p>
              </div>
           </div>
           
           <div className="text-right">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 font-['Noto_Sans_Telugu']">రసీదు సంఖ్య (ID)</h4>
              <p className="font-black text-hospital-dark leading-none">#RE-{appointment?.orderId?.slice(-8).toUpperCase()}</p>
           </div>
        </div>

        {/* Receipt Body */}
        <div className="p-10 space-y-12">
           <div className="flex flex-col items-center text-center space-y-4">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg ${isPaid ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                 <CheckCircle2 size={40} />
              </div>
              <h2 className="text-3xl font-black text-hospital-dark tracking-tight font-['Noto_Sans_Telugu'] leading-none">అపాయింట్‌మెంట్ <span className="text-hospital-secondary italic font-serif">ఖరారైంది</span></h2>
              <p className="text-[10px] uppercase font-black text-gray-300 tracking-[0.4em]">Appointment Confirmed</p>
           </div>

           <div className="grid grid-cols-2 gap-10">
              <div className="space-y-6">
                 <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-hospital-primary mb-2 flex items-center gap-2 font-['Noto_Sans_Telugu']"><User size={14} /> రోగి పేరు (Name)</h4>
                    <p className="text-xl font-black text-hospital-dark leading-none">{appointment?.name}</p>
                 </div>
                 <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-hospital-primary mb-2 flex items-center gap-2 font-['Noto_Sans_Telugu']"><Calendar size={14} /> తేదీ (Date)</h4>
                    <p className="text-xl font-black text-hospital-dark leading-none">{appointment?.appointmentDate}</p>
                 </div>
              </div>
              <div className="space-y-6">
                 <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-hospital-primary mb-2 flex items-center gap-2 font-['Noto_Sans_Telugu']"><Heart size={14} /> విభాగం (Dept)</h4>
                    <p className="text-xl font-black text-hospital-dark leading-none">{appointment?.department}</p>
                 </div>
                 <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-hospital-primary mb-2 flex items-center gap-2 font-['Noto_Sans_Telugu']"><FileText size={14} /> టోకెన్ ID (Token)</h4>
                    <p className="text-xl font-black text-hospital-primary leading-none">{appointment?.token}</p>
                 </div>
              </div>
           </div>

            <div className={`p-8 rounded-[32px] flex flex-col md:flex-row items-center justify-between shadow-inner ${isPaid ? 'bg-green-50/50' : 'bg-orange-50/50'} gap-6`}>
              <div className="text-center md:text-left">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 leading-none font-['Noto_Sans_Telugu']">చెల్లించాల్సిన మొత్తం (Total)</h4>
                 <h3 className="text-4xl font-black text-hospital-dark">₹{appointment?.reason?.match(/₹(\d+)/)?.[1] || '100.00'}</h3>
              </div>
              <div className={`px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest ${isPaid ? 'bg-green-600 text-white shadow-xl' : 'border-2 border-orange-500 text-orange-600'}`}>
                 {isPaid ? 'Paid Online' : <span className="font-['Noto_Sans_Telugu'] tracking-normal text-sm font-black lowercase">కౌంటర్‌లో చెల్లించండి / Pay at Counter</span>}
              </div>
           </div>
           
           <div className="flex flex-col items-center pt-8 border-t border-gray-100">
              <div className="flex items-center gap-2 text-hospital-secondary opacity-20 mb-6">
                 <div className="w-1.5 h-1.5 rounded-full bg-hospital-primary"></div>
                 <div className="w-1.5 h-1.5 rounded-full bg-hospital-secondary"></div>
                 <div className="w-1.5 h-1.5 rounded-full bg-hospital-primary"></div>
              </div>
              <p className="text-center text-[8px] font-bold text-gray-300 uppercase tracking-[0.3em] italic">Commitment to Excellence since 2005</p>
           </div>
        </div>

        {/* Bottom Perforation Effect */}
        <div className="absolute -bottom-1 left-0 flex justify-around w-full">
           {[...Array(15)].map((_, i) => (
             <div key={i} className="w-4 h-4 bg-hospital-background rounded-full -mb-2"></div>
           ))}
        </div>
      </motion.div>

      <footer className="mt-12 text-center space-y-4">
         <p className="text-gray-400 font-bold flex items-center gap-2">
            <Heart size={16} fill="currentColor" className="text-hospital-secondary" /> SRI KAMALA HOSPITAL MANAGEMENT SYSTEM
         </p>
         <button onClick={() => window.print()} className="bg-hospital-dark text-white px-10 py-4 rounded-full font-black shadow-xl hover:scale-110 active:scale-95 transition-all">
            PRINT RECEIPT
         </button>
      </footer>
    </div>
  );
};

export default Receipt;
