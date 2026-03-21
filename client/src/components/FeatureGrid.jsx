import React from 'react';
import { Stethoscope, FlaskConical, ShoppingBag, ListChecks, Search, Ambulance, ChevronRight, Activity, Plus, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const FeatureGrid = () => {
  const items = [
    { title: 'GP Consultation', telugu: 'జనరల్ కన్సల్టేషన్', description: 'Real-time slot confirmation.', icon: <Stethoscope size={18} />, link: '/book', bg: 'bg-emerald-50/50', text: 'text-emerald-700', border: 'border-emerald-100' },
    { title: 'AI Prognosis', telugu: 'AI రోగ నిర్ధారణ', description: 'Neural-net symptom analysis.', icon: <Sparkles size={18} />, link: '/ai-health', bg: 'bg-indigo-50/50', text: 'text-indigo-700', border: 'border-indigo-100' },
    { title: 'Pathology Lab', telugu: 'పాథాలజీ ల్యాబ్', description: 'Diagnostic profiling & tests.', icon: <FlaskConical size={18} />, link: '/diagnosis', bg: 'bg-rose-50/50', text: 'text-rose-700', border: 'border-rose-100' },
    { title: 'Internal Pharmacy', telugu: 'అంతర్గత ఫార్మసీ', description: 'Stock & medicine registry.', icon: <ShoppingBag size={18} />, link: '/medical-shop', bg: 'bg-blue-50/50', text: 'text-blue-700', border: 'border-blue-100' },
    { title: 'Patient Reviews', telugu: 'రోగుల విశ్లేషణ', description: 'Verified hospital feedback.', icon: <ListChecks size={18} />, link: '/reviews', bg: 'bg-purple-50/50', text: 'text-purple-700', border: 'border-purple-100' },
    { title: 'Our Doctors', telugu: 'మా వైద్యులు', description: 'Consult our Specialists.', icon: <Ambulance size={18} />, link: '/doctors', bg: 'bg-sky-50/50', text: 'text-sky-700', border: 'border-sky-100' },
  ];

  return (
    <section id="services" className="py-20 px-6 md:px-12 bg-white flex justify-center items-center overflow-hidden">
      <div className="container mx-auto max-w-7xl relative">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-8">
            <div className="max-w-xl">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-xl bg-hospital-primary flex items-center justify-center text-white shadow-lg"><Activity size={16} /></div>
                  <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-hospital-secondary">Our Core Services</h4>
               </div>
               <h2 className="text-3xl lg:text-4xl font-black text-hospital-dark mb-2 font-['Noto_Sans_Telugu']">ముఖ్యమైన సేవలు</h2>
               <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-4">Precision Medical Solutions</p>
               <p className="text-xs font-medium text-gray-500 max-w-sm">Comprehensive healthcare optimized through digital precision and human touch.</p>
            </div>
            <button className="premium-button bg-gray-50 text-gray-400 border border-gray-100 hover:text-hospital-primary text-[10px] px-8 py-3">
               VIEW FULL CATALOG <ChevronRight size={12} />
            </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <motion.div key={i} whileHover={{ y: -6 }} transition={{ duration: 0.5, type: 'spring' }}
                className={`group p-8 rounded-[48px] border transition-all duration-700 hover:shadow-2xl ${item.bg} ${item.border}`}>
                
                <div className="flex justify-between items-start mb-8">
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:bg-hospital-primary group-hover:text-white ${item.bg} ${item.text} border border-current/10`}>
                      {item.icon}
                   </div>
                   <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-200 group-hover:text-hospital-secondary transition-all">
                      <Plus size={14} />
                   </div>
                </div>

                <h3 className="text-xl font-black text-hospital-dark mb-1 tracking-tight font-['Noto_Sans_Telugu']">{item.telugu}</h3>
                <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-4">{item.title}</p>
                <p className="text-[11px] font-medium text-gray-400 mb-8 leading-relaxed max-w-[180px]">{item.description}</p>
                
                <Link to={item.link} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-hospital-dark group-hover:text-hospital-secondary transition-colors">
                   Get Started <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
