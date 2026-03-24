import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Download, Heart, ArrowLeft, FileText, Globe, Zap, ShieldCheck, Activity, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAppointmentByToken } from '../utils/api';

const Receipt = () => {
   const [searchParams] = useSearchParams();
   const navigate = useNavigate();
   const token = searchParams.get('token');
   const [appointment, setAppointment] = useState(null);
   const [loading, setLoading] = useState(true);
   const [receiptId] = useState(() => `SKH-RE-${Date.now().toString().slice(-6)}`);

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

   const isPaid = appointment?.paymentStatus === 'Paid';
   const isDiagnostic = appointment?.token?.startsWith('KAMALADIA');
   const servicePhone = isDiagnostic ? '98668 95634' : '99480 76665';
   const serviceTitle = isDiagnostic ? 'SRI KAMALA | DIAGNOSTIC NODE' : 'SRI KAMALA | CLINICAL CORE';

   if (loading) return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black gap-8">
         <motion.div animate={{ rotate: 360, scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-20 h-20 border-4 border-hospital-primary/20 border-t-hospital-primary rounded-[30px] shadow-neon-primary" />
         <p className="text-[10px] font-black text-white uppercase tracking-[0.6em] animate-pulse italic">Synchronizing Receipt Matrix...</p>
      </div>
   );

   return (
      <div className="min-h-screen bg-[#050505] p-6 md:p-12 font-sans flex flex-col items-center relative overflow-hidden">

         {/* Background Decor */}
         <div className="fixed inset-0 z-0 pointer-events-none opacity-20 overflow-hidden">
            <div className="absolute top-[15%] right-[20%] w-[500px] h-[500px] bg-hospital-primary/10 rounded-full blur-[140px] animate-pulse-soft"></div>
            <div className="absolute bottom-[25%] left-[15%] w-[400px] h-[400px] bg-hospital-secondary/10 rounded-full blur-[120px] animate-pulse-soft" style={{ animationDelay: '3s' }}></div>
         </div>

         <header className="w-full max-w-4xl flex items-center justify-between mb-12 relative z-10">
            <button onClick={() => navigate('/')} className="flex items-center gap-4 text-white font-black hover:text-hospital-primary transition-all group active:scale-90">
               <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:-translate-x-2 transition-transform shadow-4xl backdrop-blur-3xl">
                  <ArrowLeft size={20} />
               </div>
               <span className="text-[11px] font-black uppercase tracking-[0.4em] italic">De-activate Session</span>
            </button>
            <div className="flex gap-4">
               <button onClick={() => window.print()} className="p-4 bg-white/5 text-hospital-primary rounded-2xl border border-white/10 shadow-4xl hover:bg-white/10 active:scale-90 transition-all backdrop-blur-3xl">
                  <Download size={24} />
               </button>
            </div>
         </header>

         <motion.div initial={{ y: 50, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }}
            className="w-full max-w-4xl bg-[#0a0a0a] rounded-[60px] shadow-4xl border border-white/10 relative overflow-hidden print:shadow-none print:border-white/20 backdrop-blur-3xl">

            {/* Pass Header */}
            <div className="p-14 bg-white/5 border-b border-white/10 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-80 h-80 bg-hospital-primary opacity-[0.03] rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2"></div>
               <div className="flex flex-col lg:flex-row justify-between items-center gap-12 relative z-10 text-white">
                  <div className="flex items-center gap-8">
                     <div className="w-24 h-24 p-3 bg-white rounded-[32px] shadow-4xl flex items-center justify-center group overflow-hidden relative">
                        <div className="absolute inset-0 bg-hospital-primary opacity-0 group-hover:opacity-10 transition-opacity"></div>
                        <img src="/logo.png" className="w-full h-full object-contain relative z-10" />
                     </div>
                     <div className="text-center lg:text-left">
                        <h1 className="text-5xl font-black font-['Noto_Sans_Telugu'] mb-3 tracking-tighter italic">శ్రీ కమల హాస్పిటల్</h1>
                        <p className="text-[11px] uppercase font-black tracking-[0.5em] text-hospital-primary leading-none italic opacity-70">{serviceTitle}</p>
                        <div className="mt-6 flex flex-wrap gap-4 justify-center lg:justify-start">
                           <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black uppercase tracking-widest text-gray-500 italic">M.G. ROAD, SURYAPET</div>
                           <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black uppercase tracking-widest text-gray-500 italic">TEL: {servicePhone}</div>
                        </div>
                     </div>
                  </div>

                  <div className="bg-black/40 p-8 rounded-[40px] border border-white/10 backdrop-blur-3xl text-center min-w-[220px] shadow-4xl group">
                     <p className="text-[10px] font-black text-hospital-primary uppercase tracking-[0.5em] mb-4 leading-none italic">SECURE TOKEN</p>
                     <p className="text-5xl font-black font-mono tracking-tighter text-white group-hover:scale-110 transition-transform">{appointment?.token}</p>
                     <div className={`mt-6 py-2 px-4 rounded-full text-[9px] font-black uppercase tracking-[0.4em] italic flex items-center justify-center gap-2 ${isPaid ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'}`}>
                        {isPaid ? <><CheckCircle2 size={12} /> Verified & Active</> : <><Activity size={12} /> Pending Verification</>}
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-16 lg:p-24">
               <div className="flex flex-col lg:flex-row justify-between items-start gap-16 mb-20">
                  <div className="space-y-10">
                     <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-gray-700 mb-8 italic">PATIENT IDENTIFICATION LOG</h3>
                     <div className="space-y-4">
                        <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.3em] leading-none mb-1 italic">Verified Subject Name</p>
                        <p className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none underline decoration-hospital-secondary/20 underline-offset-8">{appointment?.name || 'SYNCING...'}</p>
                     </div>
                     <div className="grid grid-cols-2 gap-12 pt-8">
                        <div>
                           <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.3em] mb-3 italic">Age / Gender Profile</p>
                           <p className="font-black text-xl text-white italic">{appointment?.age}Y / {appointment?.gender}</p>
                        </div>
                        <div>
                           <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.3em] mb-3 italic">Autonomous Contact</p>
                           <p className="font-black text-xl text-white font-mono tracking-tight italic">{appointment?.phone}</p>
                        </div>
                     </div>
                  </div>

                  <div className="text-center lg:text-right space-y-6 w-full lg:w-auto">
                     <div className="p-8 bg-white/5 rounded-[40px] border border-white/5 flex flex-col items-center lg:items-end shadow-inner">
                        <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] mb-4 leading-none italic">Institutional Schedule</p>
                        <p className="text-3xl font-black text-white italic leading-none">{appointment?.appointmentDate}</p>
                     </div>
                     <div className="flex items-center justify-center lg:justify-end gap-3 text-red-500/40 text-[9px] font-black uppercase tracking-[0.3em] italic">
                        <Clock size={12} /> Expiring in 24 Clinical Hours
                     </div>
                  </div>
               </div>

               <div className="mb-20">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-gray-700 mb-10 italic border-b border-white/5 pb-6">CLINICAL SERVICE NODE</h3>
                  <div className="flex flex-col md:flex-row items-center justify-between p-10 bg-white/5 border border-white/10 rounded-[50px] shadow-4xl backdrop-blur-3xl group">
                     <div className="flex items-center gap-8">
                        <div className="w-20 h-20 bg-hospital-primary/10 border border-white/10 rounded-[28px] flex items-center justify-center text-hospital-primary shadow-inner group-hover:scale-110 transition-transform">
                           <ShieldCheck size={32} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] mb-3 leading-none italic">Assigned Clinical Specialization</p>
                           <p className="text-3xl font-black text-white uppercase font-['Noto_Sans_Telugu'] tracking-tighter italic">{appointment?.department}</p>
                        </div>
                     </div>
                     <div className="text-center lg:text-right mt-10 md:mt-0">
                        <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] mb-3 leading-none italic">Authorized Service Fee</p>
                        <p className="text-6xl font-black text-white tabular-nums tracking-tighter glow-text">₹{appointment?.reason?.match(/₹(\d+)/)?.[1] || '100.00'}</p>
                     </div>
                  </div>
               </div>

               <div className="flex flex-col lg:flex-row justify-between items-end gap-16">
                  <div className="max-w-md space-y-8">
                     <div className="flex items-center gap-6 text-gray-600 bg-black/40 p-6 rounded-[35px] border border-white/5 shadow-inner">
                        <FileText size={24} className="text-hospital-secondary opacity-40" />
                        <div className="space-y-1">
                           <p className="text-[11px] font-black uppercase tracking-[0.4em] leading-none italic">OFFICIAL DIGITAL PASS V4</p>
                           <p className="text-[9px] text-gray-800 font-black uppercase tracking-[0.2em]">{receiptId}</p>
                        </div>
                     </div>
                     <p className="text-[10px] font-bold text-gray-600 italic leading-relaxed font-serif uppercase tracking-widest">Presenter must synchronize this digital pass at the clinical reception node upon arrival. Priority queue follows neural token sequence orchestration.</p>
                  </div>

                  <div className="flex flex-col items-center gap-6 relative group">
                     <div className="w-32 h-32 bg-white/5 border border-white/10 rounded-[35px] p-6 flex items-center justify-center shadow-4xl relative overflow-hidden active:scale-95 transition-all">
                        <div className="absolute inset-0 bg-hospital-primary opacity-0 group-hover:opacity-10 transition-opacity"></div>
                        <div className="w-full h-full bg-hospital-primary/20 rounded-2xl flex items-center justify-center group-hover:rotate-45 transition-transform duration-1000">
                           <Cpu size={40} className="text-hospital-primary shadow-neon-primary" />
                        </div>
                     </div>
                     <p className="text-[10px] font-black uppercase tracking-[0.6em] text-hospital-secondary text-center italic">Institutional Stamp <br /><span className="text-[8px] opacity-40">Verified by core</span></p>
                  </div>
               </div>
            </div>

            <div className="bg-white/5 p-8 text-center border-t border-white/5 flex items-center justify-center gap-6">
               <div className="flex items-center gap-3 text-[10px] font-black text-gray-700 uppercase tracking-[0.6em] italic">
                  <Globe size={14} /> SRH-NODE-PRIMARY.NET
               </div>
               <div className="h-1 w-1 bg-gray-800 rounded-full"></div>
               <div className="flex items-center gap-3 text-[10px] font-black text-gray-700 uppercase tracking-[0.6em] italic">
                  <Activity size={14} /> CLINICAL TELEMETRY ACTIVE
               </div>
            </div>

            {/* Decorative Ticket Cuts */}
            <div className="absolute top-1/2 left-0 w-8 h-16 bg-[#050505] rounded-r-full -translate-x-1/2 border-r border-white/10 hidden lg:block"></div>
            <div className="absolute top-1/2 right-0 w-8 h-16 bg-[#050505] rounded-l-full translate-x-1/2 border-l border-white/10 hidden lg:block"></div>

         </motion.div>

         <footer className="mt-20 text-center space-y-8 relative z-10 w-full">
            <div className="flex items-center justify-center gap-4 text-gray-700">
               <div className="h-px w-20 bg-white/5"></div>
               <p className="text-[11px] font-black flex items-center gap-4 uppercase tracking-[0.4em] italic leading-none">
                  <Heart size={20} className="text-hospital-secondary animate-pulse" fill="currentColor" /> SRI KAMALA INSTITUTIONAL OPS
               </p>
               <div className="h-px w-20 bg-white/5"></div>
            </div>
            <div className="flex justify-center gap-6">
               <button onClick={() => navigate('/')} className="px-12 py-6 bg-white/5 text-white border border-white/10 rounded-full font-black text-[10px] tracking-[0.5em] shadow-4xl hover:bg-white/10 active:scale-90 transition-all uppercase italic">CLOSE TERMINAL</button>
               <button onClick={() => window.print()} className="px-12 py-6 bg-white text-black rounded-full font-black text-[10px] tracking-[0.5em] shadow-4xl hover:bg-hospital-primary active:scale-90 transition-all uppercase italic">PRESERVE HARDCOPY</button>
            </div>
            <p className="text-[8px] font-black text-gray-800 uppercase tracking-[0.8em] italic">Authorized Access Only // HIPAA SECURE SESSION ID: {receiptId}</p>
         </footer>
      </div>
   );
};

export default Receipt;
