import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Award, HeartPulse, ShieldCheck, Activity, Star } from 'lucide-react';

const doctors = [
  { name: 'Dr. Venkat Rao', specialty: 'Diabetology & General', exp: '25+ Yrs', img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400&h=400', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  { name: 'Dr. S. Kamal', specialty: 'Emergency & Critical Care', exp: '15+ Yrs', img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400&h=400', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
  { name: 'Dr. Anita Reddy', specialty: 'General Physician', exp: '10+ Yrs', img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400&h=400', color: 'bg-pink-50 text-pink-600 border-pink-100' },
  { name: 'Dr. Rajesh G.', specialty: 'Internal Medicine', exp: '12+ Yrs', img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400&h=400', color: 'bg-blue-50 text-blue-600 border-blue-100' },
];

const Doctors = () => {
  return (
    <section id="doctors" className="py-20 bg-white relative overflow-hidden flex justify-center items-center">
      <div className="absolute top-0 right-0 w-[50%] h-full bg-hospital-secondary/5 rounded-bl-[300px] z-0 pointer-events-none"></div>
      
      <div className="container mx-auto max-w-7xl relative z-10 px-6">
        <div className="flex flex-col lg:flex-row items-end justify-between mb-16 gap-8 text-center lg:text-left">
            <div className="max-w-2xl">
               <div className="flex items-center gap-3 mb-6 justify-center lg:justify-start">
                  <div className="w-10 h-10 rounded-2xl bg-hospital-dark flex items-center justify-center text-white shadow-lg"><HeartPulse size={20} /></div>
                  <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-hospital-secondary underline decoration-dotted decoration-hospital-secondary/30">Clinical Specialists</h4>
               </div>
               <h2 className="text-4xl lg:text-5xl font-black text-hospital-dark mb-2 leading-none font-['Noto_Sans_Telugu'] tracking-tight">శిక్షణ పొందిన <span className="text-hospital-secondary italic font-serif">వైద్యులు</span>.</h2>
               <p className="text-[10px] uppercase font-bold text-gray-300 tracking-[0.3em] mb-4">Elite Panel of Medical Pioneers</p>
               <p className="text-xs font-medium text-gray-500 max-w-sm">Experience expert consultancy in Suryapet with talent available 24/7 for you.</p>
            </div>
            <button className="premium-button bg-hospital-dark text-white px-8 py-4 shadow-xl hover:scale-105 active:scale-95 transition-all">
               <span className="font-['Noto_Sans_Telugu'] text-base mr-3 font-bold tracking-tight">అపాయింట్‌మెంట్</span> <ChevronRight size={14} />
            </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((doctor, index) => (
            <motion.div key={index} whileHover={{ y: -6 }} transition={{ duration: 0.8, type: 'spring' }}
                className="group bg-white rounded-[50px] border border-gray-100 shadow-sm overflow-hidden flex flex-col items-center p-6 transition-all hover:bg-hospital-dark">
                
                <div className="w-full aspect-square bg-gray-50 rounded-[40px] overflow-hidden mb-6 border-4 border-white shadow-xl relative">
                   <div className="absolute inset-0 bg-hospital-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                   <img src={doctor.img} alt={doctor.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                   <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-[#1e293b] shadow-xl">
                      ⭐ 5.0 Global Review
                   </div>
                </div>

                <div className="text-center w-full">
                    <h5 className="font-black text-xl text-hospital-dark mb-1 group-hover:text-white tracking-tighter transition-colors font-['Noto_Sans_Telugu']">{doctor.name}</h5>
                    <p className="text-[9px] font-black uppercase tracking-widest text-hospital-primary mb-6">{doctor.specialty}</p>
                    
                    <div className="flex gap-2 justify-center mb-6">
                       <div className="px-3 py-1 bg-gray-50 rounded-full text-[8px] font-black text-gray-400 uppercase tracking-widest transition-colors group-hover:bg-white/10 group-hover:text-white/60">{doctor.exp} EXPERTISE</div>
                    </div>

                    <button className="w-full p-3.5 rounded-[32px] border-2 border-gray-50 group-hover:border-hospital-primary group-hover:bg-hospital-primary text-gray-300 group-hover:text-white font-black text-[10px] uppercase tracking-widest transition-all">
                       VIEW CLINICAL STATS
                    </button>
                </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Doctors;
