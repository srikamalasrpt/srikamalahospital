import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Award, HeartPulse, ShieldCheck, Activity, Star, MessageSquare, Scissors, Syringe, Droplets, Plus } from 'lucide-react';
import DoctorConsultationModal from './DoctorConsultationModal';
import drKiran from '../assets/dr-kiran.jpg';

const doctors = [
  {
    id: 'dr_kiran',
    name: 'Dr. D. Kiran',
    specialty: 'General Medicine (MD)',
    exp: '15+ Yrs',
    img: drKiran,
    color: 'bg-hospital-primary/10 text-hospital-primary border-hospital-primary/20',
    keywords: ['general medicine', 'physician', 'internal'],
    regNo: '64309',
    qualification: 'MBBS, MD (General Medicine)'
  }
];

const Doctors = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConsult = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  return (
    <section id="doctors" className="py-32 bg-black relative overflow-hidden flex justify-center items-center">
      
      {/* Background Decor - Midnight Mesh */}
      <div className="absolute top-0 right-0 w-[50%] h-full bg-hospital-secondary/5 rounded-bl-[300px] z-0 pointer-events-none animate-pulse-soft"></div>
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-hospital-primary/5 rounded-tr-[200px] z-0 pointer-events-none"></div>

      <div className="container mx-auto max-w-7xl relative z-10 px-6">
        <div className="flex flex-col lg:flex-row items-end justify-between mb-24 gap-10 text-center lg:text-left">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-10 justify-center lg:justify-start">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-hospital-primary shadow-4xl shadow-hospital-primary/10"><HeartPulse size={28} /></div>
              <div>
                <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-hospital-secondary">Elite Clinical Specialists</h4>
                <p className="text-[8px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-1">Global Medical Board Certified</p>
              </div>
            </div>
            <h2 className="text-4xl lg:text-8xl font-black text-white mb-6 leading-[0.9] font-['Noto_Sans_Telugu'] tracking-tight">శిక్షణ పొందిన <span className="text-hospital-secondary italic font-serif">వైద్యులు</span>.</h2>
            <p className="text-[11px] uppercase font-bold text-gray-600 tracking-[0.6em] mb-10 leading-none">Elite Panel of Certified Medical Pioneers</p>
            <p className="text-[15px] font-medium text-gray-400 max-w-sm font-serif italic">"Experience world-class clinical expertise in Suryapet with specialists available for precise diagnostic interventions."</p>
          </div>
          <button className="group relative px-12 py-6 bg-white text-black rounded-[35px] font-black text-[11px] uppercase tracking-[0.4em] shadow-4xl overflow-hidden hover:scale-105 active:scale-95 transition-all">
            <span className="relative z-10 flex items-center gap-3 font-['Noto_Sans_Telugu'] text-xl font-bold tracking-normal group-hover:text-white transition-colors">అపాయింట్‌మెంట్ <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" /></span>
            <div className="absolute inset-0 bg-hospital-dark opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>

        <div className="flex justify-center">
          {doctors.map((doctor, index) => (
            <motion.div key={index} whileHover={{ y: -15 }} transition={{ duration: 1, type: 'spring' }}
                className="group bg-white/5 backdrop-blur-3xl rounded-[60px] border border-white/5 shadow-4xl overflow-hidden flex flex-col items-center p-14 max-w-md transition-all hover:border-white/20 active:scale-95">
                
                <div className="w-full aspect-square bg-white/5 rounded-[45px] overflow-hidden mb-12 border border-white/10 shadow-4xl relative">
                   <div className="absolute inset-0 bg-hospital-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                   <img src={doctor.img} alt={doctor.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-115 grayscale group-hover:grayscale-0" />
                   <div className="absolute top-6 left-6 bg-black/80 backdrop-blur-xl px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest text-hospital-primary shadow-2xl border border-white/10">
                      ⭐ 5.0 Precision Rating
                   </div>
                </div>

                <div className="text-center w-full">
                    <h5 className="font-black text-3xl text-white mb-2 group-hover:text-hospital-primary tracking-tighter transition-colors font-['Noto_Sans_Telugu']">{doctor.name}</h5>
                    <p className="text-[12px] font-black uppercase tracking-[0.3em] text-hospital-primary mb-4 underline decoration-dotted decoration-hospital-primary/30">{doctor.qualification}</p>
                    <p className="text-[9px] font-black text-gray-500 group-hover:text-white/40 mb-10 uppercase tracking-[0.6em]">TS Council Reg: {doctor.regNo} / Active</p>
                    
                    <div className="flex gap-4 justify-center mb-12">
                       <div className="px-6 py-3 bg-white/5 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest transition-colors group-hover:bg-white/10 group-hover:text-white">{doctor.exp} CLINICAL EXPERTISE</div>
                    </div>

                    <button onClick={() => handleConsult(doctor)} className="w-full p-6 rounded-[35px] border border-white/10 bg-hospital-secondary text-white font-black text-[11px] uppercase tracking-[0.4em] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-4 group-hover:bg-white group-hover:text-black shadow-4xl group-hover:shadow-hospital-secondary/30">
                       <MessageSquare size={20} className="animate-pulse" /> Consult Dr. Kiran
                    </button>
                </div>
            </motion.div>
          ))}
        </div>
      </div>
      <DoctorConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} doctor={selectedDoctor} />

       {/* Local Decorations */}
       <div className="absolute top-1/4 left-[5%] opacity-[0.03] text-white rotate-45"><Scissors size={150} /></div>
       <div className="absolute bottom-1/4 right-[5%] opacity-[0.03] text-white -rotate-45"><Syringe size={150} /></div>
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 opacity-[0.01] text-white"><Plus size={300} /></div>

    </section>
  );
};

export default Doctors;
