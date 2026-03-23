import React from 'react';
import { Calendar, Phone, MapPin, FlaskConical, ChevronRight, Activity, ArrowUpRight, Sparkles, Orbit, Microscope, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const QuickActionGrid = () => {
    const actions = [
        { 
            title: 'Diagnostic Lab', 
            telugu: 'రక్త పరీక్షలు', 
            description: 'Precision molecular diagnosis.', 
            icon: <FlaskConical size={24} />, 
            link: '/diagnosis', 
            color: 'bg-hospital-primary/10', 
            iconColor: 'text-hospital-primary',
            accent: 'bg-hospital-primary'
        },
        { 
            title: 'Cardiac AI', 
            telugu: 'గుండె ఆరోగ్యం', 
            description: 'Advanced arrhythmia detection.', 
            icon: <Activity size={24} />, 
            link: '/ai-health', 
            color: 'bg-hospital-secondary/10', 
            iconColor: 'text-hospital-secondary',
            accent: 'bg-hospital-secondary'
        },
        { 
            title: 'Online Pharmacy', 
            telugu: 'మందులు ఆర్డర్', 
            description: 'Direct clinical apothecary.', 
            icon: <Bot size={24} />, 
            link: '/medical-shop', 
            color: 'bg-hospital-dark/5', 
            iconColor: 'text-hospital-dark',
            accent: 'bg-hospital-dark'
        },
        { 
            title: 'Emergency Core', 
            telugu: 'అత్యవసర విభాగం', 
            description: 'Immediate Level-1 trauma response.', 
            icon: <Phone size={24} />, 
            link: 'tel:+919154404051', 
            color: 'bg-red-50', 
            iconColor: 'text-red-600',
            accent: 'bg-red-600'
        },
    ];

    return (
        <section className="py-24 px-6 bg-white relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-20 bg-gradient-to-b from-gray-100 to-transparent"></div>
            
            <div className="container mx-auto max-w-7xl">
                
                <div className="flex flex-col items-center text-center mb-16">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 border border-gray-100 mb-6 animate-spin-slow">
                        <Orbit size={20} />
                    </div>
                    <h2 className="text-3xl lg:text-5xl font-black text-hospital-dark tracking-tighter mb-4">Functional <span className="text-hospital-primary">Modules</span></h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Integrated Clinical Infrastructure Gateway</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {actions.map((action, i) => (
                        <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.8 }}
                            whileHover={{ y: -10 }}
                            className={`group relative p-10 rounded-[40px] shadow-2xl shadow-hospital-dark/5 border border-gray-50 overflow-hidden cursor-pointer bg-white h-[350px] flex flex-col justify-between transition-all duration-700`}
                        >
                            {/* Animated Background Element */}
                            <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[60px] opacity-20 group-hover:scale-150 transition-transform duration-700 ${action.accent}`}></div>
                            
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className={`mb-8 w-16 h-16 rounded-[24px] flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 ${action.color} border border-white/50 backdrop-blur-sm`}>
                                    <div className={action.iconColor}>{action.icon}</div>
                                </div>
                                
                                <h3 className="text-2xl font-black font-['Noto_Sans_Telugu'] mb-3 leading-none group-hover:text-hospital-primary transition-colors">{action.telugu}</h3>
                                <p className="text-[9px] uppercase font-black tracking-[0.4em] text-gray-300 mb-6 italic">{action.title}</p>
                                <p className="text-xs font-medium text-gray-500 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500">{action.description}</p>
                            </div>
                            
                            <div className="relative z-10 mt-auto">
                                {action.link.startsWith('http') || action.link.startsWith('tel') ? (
                                    <a href={action.link} className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] transition-all border border-gray-100 group-hover:bg-hospital-dark group-hover:text-white group-hover:border-transparent group-hover:shadow-2xl`}>
                                        Execute <ArrowUpRight size={14} />
                                    </a>
                                ) : (
                                    <Link to={action.link} className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] transition-all border border-gray-100 group-hover:bg-hospital-dark group-hover:text-white group-hover:border-transparent group-hover:shadow-2xl`}>
                                        Access Core <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                )}
                            </div>

                        </motion.div>
                    ))}
                </div>

                {/* Decorative Elements */}
                <div className="mt-20 flex justify-center opacity-10">
                    <div className="flex items-center gap-12 grayscale">
                        <Microscope size={40} className="animate-pulse" />
                        <Sparkles size={40} className="animate-pulse" style={{ animationDelay: '1s' }} />
                        <Bot size={40} className="animate-pulse" style={{ animationDelay: '2s' }} />
                    </div>
                </div>

            </div>
        </section>
    );
};

export default QuickActionGrid;
