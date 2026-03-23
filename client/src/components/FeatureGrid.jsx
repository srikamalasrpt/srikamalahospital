import React from 'react';
import { Stethoscope, FlaskConical, ShoppingBag, ListChecks, Search, Ambulance, ChevronRight, Activity, Plus, Sparkles, Brain, Heart, Microscope } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const FeatureGrid = () => {
  const items = [
    { 
        title: 'Clinical Diagnostics', 
        telugu: 'జనరల్ కన్సల్టేషన్', 
        description: 'Elite panel GP access with real-time biometric sync.', 
        icon: <Stethoscope size={24} />, 
        link: '/book', 
        color: 'text-emerald-500', 
        bg: 'bg-emerald-500/5' 
    },
    { 
        title: 'AI Neural Core', 
        telugu: 'AI రోగ నిర్ధారణ', 
        description: 'Predictive health modeling and autonomous triage.', 
        icon: <Brain size={24} />, 
        link: '/ai-health', 
        color: 'text-indigo-500', 
        bg: 'bg-indigo-500/5' 
    },
    { 
        title: 'Pathology Lab', 
        telugu: 'పాథాలజీ ల్యాబ్', 
        description: 'Molecular precision laboratory with automated reports.', 
        icon: <Microscope size={24} />, 
        link: '/diagnosis', 
        color: 'text-rose-500', 
        bg: 'bg-rose-500/5' 
    },
    { 
        title: 'Smart Pharmacy', 
        telugu: 'అంతర్గత ఫార్మసీ', 
        description: 'Verified clinical apothecary with inventory tracking.', 
        icon: <ShoppingBag size={24} />, 
        link: '/medical-shop', 
        color: 'text-blue-500', 
        bg: 'bg-blue-500/5' 
    },
    { 
        title: 'Cardiac Monitoring', 
        telugu: 'గుండె ఆరోగ్యం', 
        description: 'Continuous cardiovascular risk assessment suite.', 
        icon: <Heart size={24} />, 
        link: '/ai-health', 
        color: 'text-red-500', 
        bg: 'bg-red-500/5' 
    },
    { 
        title: 'Emergency Response', 
        telugu: 'అత్యవసర విభాగం', 
        description: 'Level-1 critical care available 24/7/365.', 
        icon: <Sparkles size={24} />, 
        link: '/doctors', 
        color: 'text-amber-500', 
        bg: 'bg-amber-500/5' 
    },
  ];

  return (
    <section id="services" className="py-32 px-6 md:px-12 bg-[#fafafa] relative overflow-hidden">
      
      {/* Background Decorative Mesh */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-hospital-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto max-w-7xl relative">
        
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-hospital-dark flex items-center justify-center text-white shadow-xl shadow-hospital-dark/20"><Activity size={24} /></div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-hospital-secondary">Advanced Healthcare Ecosystem</h4>
                    <p className="text-[8px] font-bold text-gray-300 uppercase tracking-[0.2em] mt-1 italic">World-Class Infrastructure Matrix</p>
                  </div>
               </div>
               <h2 className="text-4xl lg:text-7xl font-black text-hospital-dark mb-4 leading-none tracking-tighter transition-all font-['Noto_Sans_Telugu']">ముఖ్యమైన <span className="text-hospital-secondary italic font-['Playfair_Display']">సేవలు</span></h2>
               <p className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.6em] mb-8">Precision Integrated Solutions</p>
            </div>
            <button className="px-10 py-5 rounded-[24px] bg-white border border-gray-100 text-hospital-dark hover:bg-hospital-primary hover:text-white hover:border-transparent text-[10px] font-black uppercase tracking-widest shadow-xl transition-all">
               ACTIVATE FULL CATALOG <ChevronRight size={14} className="inline ml-2" />
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {items.map((item, i) => (
            <motion.div key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                whileHover={{ y: -10 }}
                className={`group p-12 rounded-[50px] bg-white border border-gray-50 shadow-2xl shadow-hospital-dark/5 transition-all duration-700 relative overflow-hidden h-[400px] flex flex-col`}>
                
                {/* Accent Orb */}
                <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[60px] opacity-10 transition-transform duration-700 group-hover:scale-150 ${item.bg}`}></div>

                <div className="flex justify-between items-start mb-10">
                   <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center transition-all duration-700 group-hover:bg-hospital-dark group-hover:text-white ${item.bg} ${item.color} border border-current/10 shadow-inner group-hover:shadow-neon-primary`}>
                      {item.icon}
                   </div>
                   <div className="p-3 rounded-2xl bg-gray-50 text-gray-200 group-hover:text-hospital-secondary transition-all">
                      <Plus size={18} />
                   </div>
                </div>

                <div className="flex-1">
                    <h3 className="text-2xl font-black text-hospital-dark mb-2 tracking-tight font-['Noto_Sans_Telugu'] group-hover:text-hospital-primary transition-colors">{item.telugu}</h3>
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-300 mb-6 italic leading-none">{item.title}</p>
                    <p className="text-xs font-medium text-gray-500 leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity duration-500">{item.description}</p>
                </div>
                
                <div className="mt-auto pt-8 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <Link to={item.link} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-hospital-dark hover:text-hospital-primary">
                        Deploy Service <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform text-hospital-secondary" />
                    </Link>
                </div>

            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
