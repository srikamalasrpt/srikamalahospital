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
        icon: <Stethoscope size={26} />, 
        link: '/book', 
        color: 'text-emerald-400', 
        bg: 'bg-emerald-400/10' 
    },
    { 
        title: 'AI Neural Core', 
        telugu: 'AI రోగ నిర్ధారణ', 
        description: 'Predictive health modeling and autonomous patient triage algorithms.', 
        icon: <Brain size={26} />, 
        link: '/ai-health', 
        color: 'text-indigo-400', 
        bg: 'bg-indigo-400/10' 
    },
    { 
        title: 'Pathology Center', 
        telugu: 'పాథాలజీ ల్యాబ్', 
        description: 'Molecular precision laboratory with automated digital report delivery.', 
        icon: <Microscope size={26} />, 
        link: '/diagnosis', 
        color: 'text-rose-400', 
        bg: 'bg-rose-400/10' 
    },
    { 
        title: 'Smart Apothecary', 
        telugu: 'అంతర్గత ఫార్మసీ', 
        description: 'Verified clinical medication hub with real-time inventory tracking.', 
        icon: <ShoppingBag size={26} />, 
        link: '/medical-shop', 
        color: 'text-blue-400', 
        bg: 'bg-blue-400/10' 
    },
    { 
        title: 'Cardiac Analytics', 
        telugu: 'గుండె ఆరోగ్యం', 
        description: 'Continuous cardiovascular risk assessment and monitoring suite.', 
        icon: <Heart size={26} />, 
        link: '/ai-health', 
        color: 'text-red-400', 
        bg: 'bg-red-400/10' 
    },
    { 
        title: 'Trauma Response', 
        telugu: 'అత్యవసర విభాగం', 
        description: 'Level-1 critical care infrastructure available 24/7/365.', 
        icon: <Sparkles size={26} />, 
        link: '/doctors', 
        color: 'text-amber-400', 
        bg: 'bg-amber-400/10' 
    },
  ];

  return (
    <section id="services" className="py-32 px-6 md:px-12 bg-black relative overflow-hidden">
      
      {/* Background Decorative Mesh - High Tech Dark Style */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-hospital-primary/5 rounded-full blur-[140px] pointer-events-none animate-pulse-soft"></div>
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-hospital-secondary/5 rounded-full blur-[140px] pointer-events-none animate-pulse-soft" style={{ animationDelay: '3s' }}></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        
        <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
            <div className="max-w-2xl">
               <div className="flex items-center gap-5 mb-10">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-hospital-primary shadow-2xl shadow-hospital-primary/10 animate-float-badge"><Activity size={28} /></div>
                  <div>
                    <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-hospital-secondary">Advanced Healthcare Ecosystem v3.0</h4>
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.3em] mt-1 italic">World-Class Global Infrastructure Matrix</p>
                  </div>
               </div>
               <h2 className="text-3xl lg:text-6xl font-black text-white mb-4 leading-none tracking-tighter transition-all font-['Noto_Sans_Telugu']">ముఖ్యమైన <span className="text-hospital-secondary italic">సేవలు</span></h2>
               <p className="text-[9px] uppercase font-bold text-gray-700 tracking-[0.8em] mb-10">Precision Integrated Clinical Solutions</p>
            </div>
            <button className="animated-button group px-10 py-5 rounded-[24px] bg-white/5 border border-white/10 text-white hover:bg-hospital-primary hover:text-black hover:border-transparent text-[10px] font-black uppercase tracking-[0.5em] shadow-4xl transition-all backdrop-blur-3xl overflow-hidden relative">
               <span className="relative z-10 flex items-center gap-3">ACTIVATE FULL CATALOG <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /></span>
               <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity -z-0"></div>
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {items.map((item, i) => (
            <motion.div key={i} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 1 }}
                whileHover={{ y: -15 }}
                className={`group p-14 rounded-[60px] bg-white/5 border border-white/10 shadow-4xl transition-all duration-1000 relative overflow-hidden h-[450px] flex flex-col hover:border-white/20 active:scale-95`}>
                
                {/* Dynamic Liquid Accent */}
                <div className={`absolute -top-16 -right-16 w-40 h-40 rounded-full blur-[80px] opacity-10 transition-all duration-1000 group-hover:scale-150 group-hover:opacity-30 ${item.bg}`}></div>

                <div className="flex justify-between items-start mb-12">
                   <div className={`w-20 h-20 rounded-[30px] flex items-center justify-center transition-all duration-1000 group-hover:scale-110 group-hover:bg-hospital-dark group-hover:border-hospital-primary/30 ${item.bg} ${item.color} border border-white/5 shadow-2xl backdrop-blur-3xl`}>
                      {item.icon}
                   </div>
                   <div className="p-4 rounded-2xl bg-white/5 text-gray-700 group-hover:text-hospital-secondary transition-all group-hover:rotate-180 duration-700">
                      <Plus size={20} />
                   </div>
                </div>

                <div className="flex-1">
                    <h3 className="text-3xl font-black text-white mb-3 tracking-tighter font-['Noto_Sans_Telugu'] group-hover:text-hospital-primary transition-colors">{item.telugu}</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 mb-8 italic leading-none">{item.title}</p>
                    <p className="text-xs font-medium text-gray-400 leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity duration-700 font-serif lowercase italic">"{item.description}"</p>
                </div>
                
                <div className="mt-auto pt-10 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-all duration-700">
                    <Link to={item.link} className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] text-white hover:text-hospital-primary">
                        Deploy Service <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform text-hospital-secondary" />
                    </Link>
                </div>

            </motion.div>
          ))}
        </div>
      </div>

       {/* Local Clinical Decor */}
       <div className="absolute top-1/2 right-[-5%] opacity-[0.03] text-white"><Scissors size={180} /></div>
       <div className="absolute bottom-0 left-[-5%] opacity-[0.03] text-white"><Syringe size={180} /></div>

    </section>
  );
};

export default FeatureGrid;
