import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Download, ArrowLeft, ShieldCheck, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAppointmentByToken } from '../utils/api';

const Receipt = () => {
   const [searchParams] = useSearchParams();
   const navigate = useNavigate();
   const token = searchParams.get('token');
   const [appointment, setAppointment] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      if (token) {
         fetchAppointment();
      }
   }, [token]);

   const fetchAppointment = async () => {
      try {
         const resp = await getAppointmentByToken(token);
         if (resp.data.success) {
            setAppointment(resp.data.appointment);
         }
      } catch (err) {
         console.error(err);
      } finally {
         setLoading(false);
      }
   };

   if (loading) return (
      <div className="min-h-screen flex items-center justify-center bg-hospital-surface">
         <div className="w-8 h-8 border-2 border-hospital-primary border-t-transparent rounded-full animate-spin" />
      </div>
   );

   return (
      <div className="min-h-screen bg-hospital-surface p-6 font-sans flex flex-col items-center grainy">
         <header className="w-full max-w-2xl flex items-center justify-between mb-8">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-hospital-slate hover:text-hospital-dark transition-all group">
               <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
               <span className="font-['Noto_Sans_Telugu'] text-[11px] font-bold">హోమ్ పేజీకి తిరిగి వెళ్ళండి <span className="text-[8px] opacity-40 ml-1 uppercase">Back to Home</span></span>
            </button>
            <button onClick={() => window.print()} className="p-2 bg-white rounded-lg border border-black/5 hover:shadow-md transition-all">
               <Download size={16} className="text-hospital-primary" />
            </button>
         </header>

         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl bg-white rounded-3xl shadow-premium border border-black/5 overflow-hidden print:shadow-none print:border-black/10"
         >
            <div className="p-8 border-b border-black/5 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-6">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white p-2 rounded-xl border border-black/5">
                     <img src="/logo.png" className="w-full h-full object-contain" />
                  </div>
                  <div>
                     <h1 className="text-xl font-black text-hospital-dark leading-none font-['Noto_Sans_Telugu']">శ్రీ కమల హాస్పిటల్</h1>
                     <p className="text-[10px] font-black uppercase tracking-widest text-hospital-primary mt-1">Sri Kamala Hospital</p>
                  </div>
               </div>
               <div className="text-center md:text-right">
                  <p className="font-['Noto_Sans_Telugu'] text-[10px] font-black text-hospital-slate uppercase leading-none mb-1">అపాయింట్‌మెంట్ టోకెన్ <span className="text-[7px] opacity-40 ml-1 uppercase">Token</span></p>
                  <p className="text-3xl font-black text-hospital-dark tracking-tighter">{appointment?.token}</p>
               </div>
            </div>

            <div className="p-10 space-y-10">
               <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <div>
                        <p className="font-['Noto_Sans_Telugu'] text-[10px] font-black text-hospital-slate uppercase leading-none mb-1">రోగి పేరు <span className="text-[7px] opacity-40 ml-1 uppercase">Patient Name</span></p>
                        <p className="text-xl font-bold text-hospital-dark font-['Noto_Sans_Telugu']">{appointment?.name}</p>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <p className="font-['Noto_Sans_Telugu'] text-[10px] font-black text-hospital-slate uppercase leading-none mb-1">వయస్సు / లింగం <span className="text-[7px] opacity-40 ml-1 uppercase">Age/Gen</span></p>
                           <p className="text-sm font-bold text-hospital-dark font-['Noto_Sans_Telugu']">{appointment?.age}Y / {appointment?.gender}</p>
                        </div>
                        <div>
                           <p className="font-['Noto_Sans_Telugu'] text-[10px] font-black text-hospital-slate uppercase leading-none mb-1">ఫోన్ <span className="text-[7px] opacity-40 ml-1 uppercase">Phone</span></p>
                           <p className="text-sm font-bold text-hospital-dark">{appointment?.phone}</p>
                        </div>
                     </div>
                  </div>
                  <div className="space-y-4 md:text-right">
                     <div>
                        <p className="font-['Noto_Sans_Telugu'] text-[10px] font-black text-hospital-slate uppercase leading-none mb-1">అపాయింట్‌మెంట్ తేదీ <span className="text-[7px] opacity-40 ml-1 uppercase">Date</span></p>
                        <p className="text-sm font-bold text-hospital-dark">{appointment?.appointmentDate}</p>
                     </div>
                     <div>
                        <p className="font-['Noto_Sans_Telugu'] text-[10px] font-black text-hospital-slate uppercase leading-none mb-1">విభాగం <span className="text-[7px] opacity-40 ml-1 uppercase">Dept</span></p>
                        <p className="text-sm font-bold text-hospital-primary uppercase font-['Noto_Sans_Telugu']">{appointment?.department}</p>
                     </div>
                  </div>
               </div>

               <div className="bg-slate-50 p-6 rounded-2xl border border-black/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-hospital-secondary border border-black/5">
                        <CheckCircle2 size={16} />
                     </div>
                     <p className="font-['Noto_Sans_Telugu'] text-[11px] font-bold text-hospital-dark uppercase leading-none">స్థితి: ధృవీకరించబడింది <span className="text-[8px] opacity-40 ml-1 uppercase">Status: Verified</span></p>
                  </div>
                  <div className="text-right">
                     <p className="font-['Noto_Sans_Telugu'] text-[10px] font-black text-hospital-slate uppercase leading-none mb-1">సంప్రదింపు రుసుము <span className="text-[7px] opacity-40 ml-1 uppercase">Fee</span></p>
                     <p className="text-lg font-black text-hospital-dark">₹100.00</p>
                  </div>
               </div>

               <div className="pt-6 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="max-w-xs space-y-2">
                     <p className="font-['Noto_Sans_Telugu'] text-[11px] text-hospital-slate/80 leading-relaxed font-bold italic">
                        దయచేసి రిసెప్షన్‌లో ఈ రశీదును చూపించండి. మీ టోకెన్ వరుస క్రమంలో పిలవబడుతుంది.
                     </p>
                     <p className="text-[9px] text-hospital-slate/40 leading-relaxed italic uppercase">
                        Please present this digital receipt at the reception. Your token will be called in sequential order. 
                     </p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                     <div className="w-16 h-16 bg-slate-50 rounded-xl border border-black/5 flex items-center justify-center">
                        <ShieldCheck size={28} className="text-hospital-primary/40" />
                     </div>
                     <p className="text-[7px] font-black uppercase tracking-widest text-hospital-slate/40">Secured License</p>
                  </div>
               </div>
            </div>

            <div className="bg-hospital-dark p-4 text-center">
               <p className="text-[7px] font-bold text-white/40 uppercase tracking-[0.4em]">Sri Kamala Hospital // M.G. Road, Suryapet // +91 99480 76665</p>
            </div>
         </motion.div>

         <footer className="mt-8 flex gap-4 print:hidden">
            <button onClick={() => window.print()} className="px-8 py-3 bg-hospital-dark text-white rounded-xl shadow-clinical hover:scale-105 transition-all group">
               <span className="font-['Noto_Sans_Telugu'] text-[11px] font-bold">రశీదు ప్రింట్ చేయండి <span className="text-[8px] opacity-40 ml-1 uppercase group-hover:opacity-100 transition-all">Print Receipt</span></span>
            </button>
            <button onClick={() => navigate('/')} className="px-8 py-3 bg-white text-hospital-dark border border-black/5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Close</button>
         </footer>
      </div>
   );
};

export default Receipt;
