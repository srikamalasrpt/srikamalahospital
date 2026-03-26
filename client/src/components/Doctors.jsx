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
    <section id="doctors" className="py-32 bg-hospital-surface relative overflow-hidden grainy">

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[50%] h-full bg-hospital-secondary/5 rounded-bl-[300px] pointer-events-none animate-pulse-soft"></div>
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-hospital-primary/5 rounded-tr-[200px] pointer-events-none"></div>

      <div className="container mx-auto max-w-7xl relative z-10 px-6">
        <div className="flex flex-col lg:flex-row items-end justify-between mb-24 gap-12 text-left">
          <div className="max-w-2xl">
            <div className="flex items-center gap-6 mb-10">
              <div className="w-16 h-16 rounded-[2rem] bg-white border border-white/80 flex items-center justify-center text-hospital-primary shadow-premium">
                <HeartPulse size={32} />
              </div>
              <div className="space-y-1">
                <h4 className="text-overline">Clinical Leadership // v4.0</h4>
                <p className="text-[10px] font-bold text-hospital-slate/40 uppercase tracking-[0.2em] italic">Board Certified Specialists</p>
              </div>
            </div>
            <h2 className="heading-clinical text-left">
              Medical <span className="text-hospital-secondary italic">Specialists</span>
            </h2>
            <p className="font-['Noto_Sans_Telugu'] text-2xl text-hospital-slate mt-4 font-bold">శిక్షణ పొందిన ప్రొఫెషనల్ వైద్యులు</p>
          </div>
          <button className="btn-clinical h-20 px-12 group rounded-[2.5rem]">
            <span className="flex items-center gap-4">
              RESERVE CONSULTATION
              <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </span>
          </button>
        </div>

        <div className="flex justify-center">
          {doctors.map((doctor, index) => (
            <motion.div key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="premium-card group p-12 flex flex-col items-center max-w-lg border-white/80 bg-white/40"
            >

              <div className="w-full aspect-[4/5] bg-hospital-surface rounded-[3rem] overflow-hidden mb-12 border border-white/60 shadow-clinical relative">
                <div className="absolute inset-0 bg-gradient-to-t from-hospital-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <img src={doctor.img} alt={doctor.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute top-8 left-8 glass-panel px-6 py-3 rounded-full shadow-premium border-white/80">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-hospital-primary italic">
                    ⭐ 5.0 Rating // నిపుణుడు
                  </span>
                </div>
              </div>

              <div className="text-center w-full space-y-6">
                <div className="space-y-2">
                  <h5 className="font-black text-3xl text-hospital-dark group-hover:text-hospital-primary transition-colors font-['Noto_Sans_Telugu'] tracking-tighter">
                    {doctor.name}
                  </h5>
                  <p className="text-sm font-black uppercase tracking-[0.3em] text-hospital-primary italic">
                    {doctor.qualification}
                  </p>
                </div>

                <p className="text-[10px] font-black text-hospital-slate/40 uppercase tracking-[0.5em] pb-6 border-b border-black/5">
                  REG: {doctor.regNo} // ACTIVE STATUS
                </p>

                <div className="flex justify-center">
                  <div className="px-8 py-4 glass-panel border-white/80 rounded-[2rem] text-[10px] font-black text-hospital-slate/60 uppercase tracking-[0.4em] group-hover:text-hospital-secondary transition-colors italic">
                    {doctor.exp} CLINICAL EXPERIENCE
                  </div>
                </div>

                <button onClick={() => handleConsult(doctor)} className="btn-clinical w-full h-24 group rounded-[2.5rem] bg-hospital-dark text-white hover:bg-hospital-secondary shadow-premium">
                  <span className="flex items-center justify-center gap-5">
                    <MessageSquare size={24} className="group-hover:scale-110 transition-transform" />
                    CONSULT RESIDENCY // సంప్రదించండి
                  </span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <DoctorConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} doctor={selectedDoctor} />

      {/* Local Decorations */}
      <div className="absolute top-1/4 left-[-10%] opacity-[0.01] text-hospital-dark pointer-events-none -rotate-12"><Activity size={300} /></div>
      <div className="absolute bottom-1/4 right-[-10%] opacity-[0.01] text-hospital-primary pointer-events-none rotate-12"><Award size={280} /></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 opacity-[0.01] text-hospital-slate pointer-events-none"><Plus size={400} /></div>

    </section>
  );
};

export default Doctors;
