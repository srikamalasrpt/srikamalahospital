import React from 'react';
import { Stethoscope, FlaskConical, ShoppingBag, ListChecks, Search, Ambulance, ChevronRight, Activity, Plus, Sparkles, Brain, Heart, Microscope, Droplets, Scissors, Syringe } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const FeatureGrid = () => {
  const items = [
    { 
        title: 'Clinical Diagnostics', 
        telugu: 'జనరల్ కన్సల్టేషన్', 
        description: 'Elite panel GP access with real-time biometric synchronization and triage.', 
        icon: <Stethoscope size={28} />, 
        link: '/book', 
        color: 'text-emerald-600', 
        bg: 'bg-emerald-500/10' 
    },
    { 
        title: 'AI Neural Core', 
        telugu: 'AI రోగ నిర్ధారణ', 
        description: 'Predictive health modeling and autonomous patient triage algorithms.', 
        icon: <Brain size={28} />, 
        link: '/ai-health', 
        color: 'text-indigo-600', 
        bg: 'bg-indigo-500/10' 
    },
    { 
        title: 'Pathology Center', 
        telugu: 'పాథాలజీ ల్యాబ్', 
        description: 'Molecular precision laboratory with automated digital report delivery.', 
        icon: <Microscope size={28} />, 
        link: '/diagnosis', 
        color: 'text-rose-600', 
        bg: 'bg-rose-500/10' 
    },
    { 
        title: 'Smart Apothecary', 
        telugu: 'అంతర్గత ఫార్మసీ', 
        description: 'Verified clinical medication hub with real-time inventory tracking.', 
        icon: <ShoppingBag size={28} />, 
        link: '/medical-shop', 
        color: 'text-blue-600', 
        bg: 'bg-blue-500/10' 
    },
    { 
        title: 'Cardiac Analytics', 
        telugu: 'గుండె ఆరోగ్యం', 
        description: 'Continuous cardiovascular risk assessment and monitoring suite.', 
        icon: <Heart size={28} />, 
        link: '/ai-health', 
        color: 'text-red-600', 
        bg: 'bg-red-500/10' 
    },
    { 
        title: 'Trauma Response', 
        telugu: 'అత్యవసర విభాగం', 
        description: 'Level-1 critical care infrastructure available 24/7/365.', 
        icon: <Sparkles size={28} />, 
        link: '/doctors', 
        color: 'text-amber-600', 
        bg: 'bg-amber-500/10' 
    },
  ];

  return (
    <section id="services" className="py-24 px-6 md:px-12 bg-white relative overflow-hidden border-t border-black/5">
      
      <div className="container mx-auto max-w-7xl relative z-10">
        
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="max-w-xl text-left">
               <div className="flex items-center gap-5 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-black/5 flex items-center justify-center text-hospital-primary shadow-inner"><Activity size={28} /></div>
                  <div>
                    <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-hospital-secondary">Advanced Ecosystem // v3.2</h4>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1 italic">World-Class Global Infrastructure</p>
                  </div>
               </div>
               <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 leading-[0.9] tracking-tighter transition-all font-['Noto_Sans_Telugu'] text-left">ముఖ్యమైన <span className="text-hospital-secondary italic">సేవలు</span></h2>
            </div>
            <button className="group px-10 py-5 rounded-[24px] bg-slate-900 text-white hover:bg-hospital-primary text-[11px] font-bold uppercase tracking-[0.3em] transition-all relative overflow-hidden shadow-2xl">
               <span className="relative z-10 flex items-center gap-3">EXPLORE FULL SERVICES <ChevronRight size={16} /></span>
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {items.map((item, i) => (
            <motion.div key={i} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="group p-10 rounded-[48px] bg-white border border-black/5 shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col items-start cursor-default"
            >
                <div className={`w-16 h-16 rounded-[22px] flex items-center justify-center mb-10 ${item.bg} ${item.color} shadow-lg transition-transform group-hover:rotate-12`}>
                    {item.icon}
                </div>

                <div className="flex-1 space-y-4">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter font-['Noto_Sans_Telugu'] group-hover:text-hospital-primary transition-colors leading-none">
                        {item.telugu}
                    </h3>
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 italic">
                        {item.title}
                    </p>
                    <p className="text-[15px] font-semibold text-slate-600 leading-relaxed font-['Plus_Jakarta_Sans']">
                        {item.description}
                    </p>
                </div>
                
                <div className="mt-8 w-full pt-6 border-t border-slate-50 flex justify-between items-center">
                    <Link to={item.link} className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-slate-900 group-hover:text-hospital-primary transition-colors">
                        ACTIVATE <ChevronRight size={16} />
                    </Link>
                    <Plus size={20} className="text-slate-200 group-hover:text-hospital-secondary transition-colors" />
                </div>
            </motion.div>
          ))}
        </div>
      </div>

       {/* Local Clinical Decor */}
       <div className="absolute top-1/2 right-[-5%] opacity-[0.02] text-slate-900 pointer-events-none -rotate-12"><Scissors size={180} /></div>
       <div className="absolute bottom-0 left-[-5%] opacity-[0.02] text-slate-900 pointer-events-none rotate-12"><Syringe size={180} /></div>
    </section>
  );
};

export default FeatureGrid;
