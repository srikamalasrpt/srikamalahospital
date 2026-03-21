import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Hospital, Download, Heart, ArrowLeft, FileText, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
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
  const serviceTitle = isDiagnostic ? 'SRI KAMALA HOSPITAL | DIAGNOSTICS' : 'SRI KAMALA HOSPITAL | OP SERVICES';

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#f1f5f9]">
    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} 
      className="w-16 h-16 border-4 border-hospital-primary/30 border-t-hospital-primary rounded-full shadow-xl" />
  </div>;

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-6 md:p-12 font-sans flex flex-col items-center">
      <header className="w-full max-w-4xl flex items-center justify-between mb-8">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-hospital-dark font-black hover:text-hospital-secondary transition-all group">
           <div className="p-2 bg-white rounded-xl shadow-md border border-gray-50 group-hover:-translate-x-1 transition-transform">
             <ArrowLeft size={18} />
           </div>
           Back to Home
        </button>
        <div className="flex gap-4">
           <button onClick={() => window.print()} className="p-3 bg-white text-hospital-primary rounded-xl shadow-lg border border-gray-50 hover:scale-105 active:scale-95 transition-all">
              <Download size={22} />
           </button>
        </div>
      </header>

      <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-4xl bg-white rounded-2xl shadow-3xl border border-gray-100 relative overflow-hidden print:shadow-none print:border-none">
        
        <div className="p-12 border-b-4 border-hospital-primary bg-hospital-dark relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-hospital-primary opacity-10 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2"></div>
           <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10 text-white">
              <div className="flex items-center gap-6">
                 <div className="w-20 h-20 p-2 bg-white rounded-2xl shadow-2xl flex items-center justify-center">
                    <img src="/logo.png" className="w-full h-full object-contain" />
                 </div>
                 <div>
                    <h1 className="text-4xl font-black font-['Noto_Sans_Telugu'] mb-1">శ్రీ కమల హాస్పిటల్</h1>
                    <p className="text-[10px] uppercase font-black tracking-[0.5em] text-hospital-primary leading-none">{serviceTitle}</p>
                    <div className="mt-4 space-y-1 text-gray-400 text-[10px] font-black uppercase tracking-widest leading-none">
                       <p>Opp. Tirumala Grand, M.G. Road, Suryapet</p>
                       <p>Tel: {servicePhone} | Open 24 Hours</p>
                    </div>
                 </div>
              </div>
              
              <div className="bg-white/10 p-6 rounded-2xl border border-white/10 backdrop-blur-md text-center min-w-[180px]">
                 <p className="text-[8px] font-black text-hospital-primary uppercase tracking-[0.4em] mb-2 leading-none">TOKEN NUMBER</p>
                 <p className="text-3xl font-black font-mono tracking-tighter text-white">{appointment?.token}</p>
                 <div className={`mt-3 py-1 px-3 rounded-full text-[8px] font-black uppercase tracking-widest ${isPaid ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                    {isPaid ? 'Confirmed / Paid' : 'Verify & Pay at Counter'}
                 </div>
              </div>
           </div>
        </div>

        <div className="p-16">
           <div className="flex justify-between items-start mb-16">
              <div className="space-y-3">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-6">Patient Certification</h3>
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Patient Identification</p>
                    <p className="text-2xl font-black text-hospital-dark">{appointment?.name || 'Loading...'}</p>
                 </div>
                 <div className="flex gap-10 pt-4">
                    <div>
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Age / Gender</p>
                        <p className="font-black text-sm text-hospital-dark">{appointment?.age}Y / {appointment?.gender}</p>
                    </div>
                    <div>
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Phone</p>
                        <p className="font-black text-sm text-hospital-dark font-mono">{appointment?.phone}</p>
                    </div>
                 </div>
              </div>

              <div className="text-right space-y-2">
                 <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-end">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Appointment Schedule</p>
                    <p className="text-xl font-black text-hospital-dark">{appointment?.appointmentDate}</p>
                 </div>
                 <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Valid for 24 hours only</p>
              </div>
           </div>

           <div className="mb-16">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-8 border-b border-gray-50 pb-4">Service Details</h3>
              <div className="flex items-center justify-between p-8 bg-[#fdfdfd] border-2 border-gray-50 rounded-[32px] shadow-sm">
                 <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-hospital-mint rounded-[20px] flex items-center justify-center text-hospital-primary shrink-0">
                       <Heart size={24} />
                    </div>
                    <div>
                       <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Service Sector</p>
                       <p className="text-xl font-black text-hospital-dark uppercase font-['Noto_Sans_Telugu'] tracking-tight">{appointment?.department}</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Consultation/Test Fee</p>
                    <p className="text-4xl font-black text-hospital-dark">₹{appointment?.reason?.match(/₹(\d+)/)?.[1] || '100.00'}</p>
                 </div>
              </div>
           </div>

           <div className="flex flex-col md:flex-row justify-between items-end gap-12">
              <div className="max-w-xs space-y-6">
                 <div className="flex items-center gap-4 text-gray-400 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                    <FileText size={16} />
                    <p className="text-[10px] font-black uppercase tracking-widest leading-none">Official Digital Receipt<br/><span className="text-[8px] text-gray-200 mt-1 block">{receiptId}</span></p>
                 </div>
                 <p className="text-[9px] font-medium text-gray-400 italic">Please present this digital token or a printout at the reception counter upon arrival. Priority queue follows token sequence.</p>
              </div>

              <div className="flex flex-col items-end gap-4 relative">
                 <div className="w-24 h-24 bg-hospital-dark rounded-2xl p-2 flex items-center justify-center border-4 border-gray-50 shadow-xl">
                    <div className="w-full h-full bg-hospital-primary rounded-lg opacity-20 flex items-center justify-center"><CheckCircle2 size={30} className="text-white"/></div>
                 </div>
                 <p className="text-[8px] font-black uppercase tracking-[0.4em] text-hospital-secondary">Official Stamp</p>
              </div>
           </div>
        </div>

        <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
           <div className="flex items-center justify-center gap-3 text-[10px] font-black text-gray-300 uppercase tracking-widest">
              <Globe size={12} /> srikamalahospital.store
           </div>
        </div>

        <div className="absolute -bottom-1 left-0 flex justify-around w-full">
           {[...Array(15)].map((_, i) => (
             <div key={i} className="w-4 h-4 bg-[#f1f5f9] rounded-full -mb-2"></div>
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
