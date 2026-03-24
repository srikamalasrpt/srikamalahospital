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
            icon: <FlaskConical size={26} />, 
            link: '/diagnosis', 
            color: 'bg-hospital-primary/10', 
            iconColor: 'text-hospital-primary',
            accent: 'bg-hospital-primary'
        },
        { 
            title: 'Cardiac AI Core', 
            telugu: 'గుండె ఆరోగ్యం', 
            description: 'Real-time arrhythmia detection and clinical AI metrics.', 
            icon: <Activity size={26} />, 
            link: '/ai-health', 
            color: 'bg-hospital-secondary/10', 
            iconColor: 'text-hospital-secondary',
            accent: 'bg-hospital-secondary'
        },
        { 
            title: 'Digital Pharmacy', 
            telugu: 'మందులు ఆర్డర్', 
            description: 'Verified clinical apothecary for direct home delivery.', 
            icon: <Bot size={26} />, 
            link: '/medical-shop', 
            color: 'bg-white/5', 
            iconColor: 'text-white',
            accent: 'bg-white'
        },
        { 
            title: 'Emergency Response', 
            telugu: 'అత్యవసర విభాగం', 
            description: 'Immediate Level-1 trauma response for urgent care.', 
            icon: <Phone size={26} />, 
            link: 'tel:+919154404051', 
            color: 'bg-red-500/10', 
            iconColor: 'text-red-500',
            accent: 'bg-red-500'
        },
    ];

    return (
        <section className="py-32 px-6 bg-black relative overflow-hidden">
            
            {/* Background Spire */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-white/10 to-transparent"></div>
            
            <div className="container mx-auto max-w-7xl relative z-10">
                
                <div className="flex flex-col items-center text-center mb-24">
                    <motion.div 
                        whileHover={{ scale: 1.1, rotate: 180 }}
                        className="w-16 h-16 rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-center text-hospital-primary mb-8 shadow-neon-primary"
                    >
                        <Orbit size={28} className="animate-spin-slow" />
                    </motion.div>
                    <h2 className="text-3xl lg:text-5xl font-black text-white tracking-tighter mb-4 font-['Noto_Sans_Telugu']">కార్యాచరణ <span className="text-hospital-primary italic">మాడ్యూల్స్</span></h2>
                    <p className="text-[9px] font-black uppercase tracking-[0.5em] text-gray-500 opacity-60 italic">Integrated Clinical Infrastructure Gateway v3.1</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {actions.map((action, i) => (
                        <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 1 }}
                            whileHover={{ y: -15 }}
                            className={`group relative p-12 rounded-[50px] bg-white/5 border border-white/10 overflow-hidden cursor-pointer h-[420px] flex flex-col justify-between transition-all duration-1000 backdrop-blur-3xl hover:border-hospital-primary/30 active:scale-95`}
                        >
                            {/* Animated Background High-Contrast Element */}
                            <div className={`absolute -top-16 -right-16 w-40 h-40 rounded-full blur-[80px] opacity-10 group-hover:opacity-30 group-hover:scale-150 transition-all duration-1000 ${action.accent}`}></div>
                            
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className={`mb-10 w-20 h-20 rounded-[30px] flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-12 group-hover:shadow-hospital-primary/20 transition-all duration-700 ${action.color} border border-white/10 backdrop-blur-3xl`}>
                                    <div className={action.iconColor}>{action.icon}</div>
                                </div>
                                
                                <h3 className="text-3xl font-black font-['Noto_Sans_Telugu'] mb-4 leading-none group-hover:text-hospital-primary transition-colors text-white">{action.telugu}</h3>
                                <p className="text-[10px] uppercase font-black tracking-[0.5em] text-gray-500 mb-8 italic">{action.title}</p>
                                <p className="text-xs font-medium text-gray-400 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-700">{action.description}</p>
                            </div>
                            
                            <div className="relative z-10 mt-auto">
                                <Link to={action.link} className={`w-full py-5 rounded-[24px] flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] transition-all border border-white/10 group-hover:bg-hospital-primary group-hover:text-black group-hover:border-transparent group-hover:shadow-neon-primary text-white`}>
                                   Access Portal <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </Link>
                            </div>

                        </motion.div>
                    ))}
                </div>

                {/* Decorative Matrix Elements */}
                <div className="mt-32 flex justify-center opacity-[0.05] grayscale brightness-200">
                    <div className="flex items-center gap-20">
                        <Microscope size={50} className="animate-pulse" />
                        <Sparkles size={50} className="animate-pulse" style={{ animationDelay: '1s' }} />
                        <Bot size={50} className="animate-pulse" style={{ animationDelay: '2s' }} />
                        <Heart size={50} className="animate-pulse" style={{ animationDelay: '3s' }} />
                    </div>
                </div>

            </div>

             {/* Background Local Decor */}
            <div className="absolute top-1/2 left-[-5%] opacity-[0.03] text-white"><Scissors size={150} /></div>
            <div className="absolute bottom-0 right-[-5%] opacity-[0.03] text-white"><Syringe size={150} /></div>

        </section>
    );
};

export default QuickActionGrid;
