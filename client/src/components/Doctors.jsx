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
    <section id="doctors" className="py-32 bg-white relative overflow-hidden flex justify-center items-center">
      
      {/* Background Decor - Clinical Mesh */}
      <div className="absolute top-0 right-0 w-[50%] h-full bg-hospital-secondary/5 rounded-bl-[300px] z-0 pointer-events-none animate-pulse-soft"></div>
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-hospital-primary/5 rounded-tr-[200px] z-0 pointer-events-none"></div>

      <div className="container mx-auto max-w-7xl relative z-10 px-6">
        <div className="flex flex-col lg:flex-row items-end justify-between mb-24 gap-10 text-center lg:text-left">
          <div className="max-w-2xl text-left">
            <div className="flex items-center gap-4 mb-10 justify-center lg:justify-start text-left">
              <div className="w-14 h-14 rounded-2xl bg-white border border-black/5 flex items-center justify-center text-hospital-primary shadow-xl"><HeartPulse size={28} /></div>
              <div>
                <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-hospital-secondary">Elite Clinical Specialists // నిపుణులు</h4>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 italic">Global Medical Board Certified</p>
              </div>
            </div>
            <h2 className="text-3xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight font-['Noto_Sans_Telugu'] tracking-tighter text-left">శిక్షణ పొందిన <span className="text-hospital-secondary italic font-serif text-left">వైద్యులు</span>.</h2>
            <p className="text-[10px] uppercase font-bold text-slate-300 tracking-[0.6em] mb-10 leading-none text-left">Elite Panel of Certified Medical Pioneers</p>
            <p className="text-[13px] font-medium text-slate-500 max-w-sm font-serif italic text-left">"అత్యున్నత స్థాయి వైద్య నైపుణ్యం మరియు ఖచ్చితమైన చికిత్స కోసం మా నిపుణులను సంప్రదించండి."</p>
          </div>
          <button className="animated-button group relative px-12 py-6 bg-[#0f172a] text-white rounded-[35px] font-black text-[10px] uppercase tracking-[0.4em] shadow-xl overflow-hidden active:scale-95 transition-all text-left">
            <span className="relative z-10 flex items-center gap-3 font-['Noto_Sans_Telugu'] text-lg font-bold tracking-normal group-hover:text-white transition-colors text-left">అపాయింట్‌మెంట్ <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" /></span>
          </button>
        </div>

        <div className="flex justify-center">
          {doctors.map((doctor, index) => (
            <motion.div key={index} whileHover={{ y: -15 }} transition={{ duration: 1, type: 'spring' }}
                className="group bg-white rounded-[60px] border border-black/5 shadow-2xl overflow-hidden flex flex-col items-center p-14 max-w-md transition-all hover:shadow-4xl active:scale-95 text-left">
                
                <div className="w-full aspect-square bg-slate-50 rounded-[45px] overflow-hidden mb-12 border border-black/5 shadow-inner relative text-left">
                   <div className="absolute inset-0 bg-hospital-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 text-left"></div>
                   <img src={doctor.img} alt={doctor.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-115 text-left" />
                   <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-xl px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest text-hospital-primary shadow-lg border border-black/5 italic text-left">
                      ⭐ 5.0 Precision Rating // అగ్రశ్రేణి
                   </div>
                </div>

                <div className="text-center w-full text-left">
                    <h5 className="font-black text-2xl text-slate-900 mb-2 group-hover:text-hospital-primary tracking-tighter transition-colors font-['Noto_Sans_Telugu'] text-left">{doctor.name}</h5>
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-hospital-primary mb-4 underline decoration-dotted decoration-hospital-primary/30 text-left">{doctor.qualification}</p>
                    <p className="text-[9px] font-black text-slate-300 group-hover:text-slate-500 mb-10 uppercase tracking-[0.6em] text-left">TS Council Reg: {doctor.regNo} / Active</p>
                    
                    <div className="flex gap-4 justify-center mb-12 text-left">
                       <div className="px-6 py-3 bg-slate-50 border border-black/5 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest transition-colors group-hover:bg-white group-hover:text-hospital-secondary text-left">{doctor.exp} CLINICAL EXPERTISE</div>
                    </div>

                    <button onClick={() => handleConsult(doctor)} className="animated-button w-full p-6 rounded-[30px] bg-[#0f172a] text-white font-black text-[10px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 hover:bg-hospital-secondary hover:text-white shadow-xl text-left">
                       <MessageSquare size={20} className="animate-pulse" /> సంప్రదించండి // CONSULT NOW
                    </button>
                </div>
            </motion.div>
          ))}
        </div>
      </div>
      <DoctorConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} doctor={selectedDoctor} />

       {/* Local Decorations */}
       <div className="absolute top-1/4 left-[5%] opacity-[0.03] text-slate-900 rotate-45 text-left"><Scissors size={150} /></div>
       <div className="absolute bottom-1/4 right-[5%] opacity-[0.03] text-hospital-secondary -rotate-45 text-left"><Syringe size={150} /></div>
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 opacity-[0.01] text-slate-900 text-left"><Plus size={300} /></div>

    </section>
  );
};

export default Doctors;
