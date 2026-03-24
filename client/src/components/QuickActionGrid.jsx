import React from 'react';
import { Calendar, Phone, MapPin, FlaskConical, ChevronRight, Activity, ArrowUpRight, Sparkles, Orbit, Microscope, Bot, Heart, Plus, Droplets, Scissors, Pill, Syringe } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const QuickActionGrid = () => {
    const actions = [
        { 
            title: 'Diagnostic Lab', 
            telugu: 'రక్త పరీక్షలు', 
            description: 'Precision molecular diagnosis with automated report delivery.', 
            icon: <FlaskConical size={28} />, 
            link: '/diagnosis', 
            color: 'bg-emerald-500/10', 
            iconColor: 'text-emerald-600',
            accent: 'bg-emerald-500'
        },
        { 
            title: 'Cardiac AI Core', 
            telugu: 'గుండె ఆరోగ్యం', 
            description: 'Real-time arrhythmia detection and clinical AI metrics.', 
            icon: <Activity size={28} />, 
            link: '/ai-health', 
            color: 'bg-rose-500/10', 
            iconColor: 'text-rose-600',
            accent: 'bg-rose-500'
        },
        { 
            title: 'Digital Pharmacy', 
            telugu: 'మందులు ఆర్డర్', 
            description: 'Verified clinical apothecary for direct home delivery.', 
            icon: <Bot size={28} />, 
            link: '/medical-shop', 
            color: 'bg-indigo-500/10', 
            iconColor: 'text-indigo-600',
            accent: 'bg-indigo-500'
        },
        { 
            title: 'Emergency Response', 
            telugu: 'అత్యవసర విభాగం', 
            description: 'Immediate Level-1 trauma response for urgent care.', 
            icon: <Phone size={28} />, 
            link: 'tel:+919154404051', 
            color: 'bg-red-600/10', 
            iconColor: 'text-red-700',
            accent: 'bg-red-600'
        },
    ];

    return (
        <section className="py-24 px-6 bg-white relative overflow-hidden border-t border-black/5">
            
            <div className="container mx-auto max-w-7xl relative z-10">
                
                <div className="flex flex-col items-center text-center mb-20">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="w-20 h-20 rounded-[32px] bg-slate-50 border border-black/5 flex items-center justify-center text-hospital-primary mb-8 shadow-inner"
                    >
                        <Orbit size={32} className="animate-spin-slow opacity-40" />
                    </motion.div>
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4 font-['Noto_Sans_Telugu']">
                        కార్యాచరణ <span className="text-hospital-primary italic">మాడ్యూల్స్</span>
                    </h2>
                    <p className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-400 italic">Advanced Clinical Gateway // v3.2</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {actions.map((action, i) => (
                        <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.8 }}
                            viewport={{ once: true }}
                            className="group relative p-10 rounded-[48px] bg-white border border-black/5 flex flex-col items-center text-center transition-all duration-500 hover:shadow-4xl hover:-translate-y-2 cursor-pointer shadow-xl"
                        >
                            <div className={`mb-10 w-24 h-24 rounded-[36px] flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:rotate-12 ${action.color} shadow-lg`}>
                                <div className={action.iconColor}>{action.icon}</div>
                            </div>
                            
                            <h3 className="text-2xl md:text-3xl font-black font-['Noto_Sans_Telugu'] mb-3 text-slate-900 group-hover:text-hospital-primary transition-colors">
                                {action.telugu}
                            </h3>
                            <p className="text-[10px] uppercase font-black tracking-[0.4em] text-slate-400 mb-6 italic opacity-60">
                                {action.title}
                            </p>
                            <p className="text-[14px] font-semibold text-slate-600 leading-relaxed max-w-[200px] mb-8 font-['Plus_Jakarta_Sans']">
                                {action.description}
                            </p>
                            
                            <Link to={action.link} className="mt-auto w-full py-5 rounded-[24px] bg-slate-50 text-slate-900 border border-black/5 flex items-center justify-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] group-hover:bg-[#0f172a] group-hover:text-white transition-all shadow-sm group-hover:shadow-2xl">
                                Access Portal <ArrowUpRight size={18} />
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-24 flex justify-center opacity-[0.05] grayscale contrast-200">
                    <div className="flex items-center gap-20 text-slate-900">
                        <Microscope size={50} className="animate-pulse" />
                        <Sparkles size={50} className="animate-pulse" style={{ animationDelay: '1s' }} />
                        <Bot size={50} className="animate-pulse" style={{ animationDelay: '2s' }} />
                        <Heart size={50} className="animate-pulse" style={{ animationDelay: '3s' }} />
                    </div>
                </div>
            </div>

            {/* Background Local Decor */}
            <div className="absolute top-1/2 left-[-5%] opacity-[0.02] text-slate-900 pointer-events-none"><Scissors size={150} /></div>
            <div className="absolute bottom-0 right-[-5%] opacity-[0.02] text-slate-900 pointer-events-none"><Syringe size={150} /></div>
        </section>
    );
};

export default QuickActionGrid;
