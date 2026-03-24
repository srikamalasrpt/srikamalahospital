import React, { useState } from 'react';
import { Home, Calendar, Users, FlaskConical, ShoppingBag, Activity, ChevronRight, Menu, X, ArrowLeft, HeartPulse, Sparkles, Orbit, Plus, Droplets, Scissors, Pill, Syringe, Zap, ShieldCheck, Microscope, Thermometer } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { name: 'Home', link: '/', telugu: 'హోమ్', icon: <Home size={22} /> },
        { name: 'Book', link: '/book', telugu: 'బుకింగ్', icon: <Calendar size={22} /> },
        { name: 'Doctors', link: '/doctors', telugu: 'వైద్యులు', icon: <Users size={22} /> },
        { name: 'Diagnosis', link: '/diagnosis', telugu: 'పరీక్షలు', icon: <FlaskConical size={22} /> },
        { name: 'Pharmacy', link: '/medical-shop', telugu: 'మందులు', icon: <ShoppingBag size={22} /> },
        { name: 'AI Health', link: '/ai-health', telugu: 'AI హెల్త్', icon: <Activity size={22} /> }
    ];

    const isMainPage = location.pathname === '/';

    const SidebarContent = () => (
        <div className="h-full flex flex-col items-center py-12 px-5 relative z-10">
            
            {/* Clinical ID - Root Orchestrator */}
            <Link to="/" className="mb-20 group relative">
                <motion.div 
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="w-18 h-18 bg-white/5 backdrop-blur-3xl rounded-[30px] border border-white/10 flex items-center justify-center p-3.5 relative z-10 shadow-4xl group-hover:border-hospital-primary/40 transition-colors bg-gradient-to-br from-white/5 to-transparent"
                >
                    <img src="/logo.png" alt="Sri Kamala" className="w-full h-full object-contain filter brightness-200 contrast-125" />
                    <div className="absolute -inset-1 bg-hospital-primary opacity-0 group-hover:opacity-10 blur-xl transition-opacity rounded-[30px]"></div>
                </motion.div>
                <div className="absolute top-[-5px] right-[-5px] w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-neon-secondary border-2 border-black"></div>
            </Link>

            {/* Neural Navigation Matrix */}
            <div className="flex-1 flex flex-col gap-12 items-center w-full">
                {navItems.map((item, i) => {
                    const isActive = location.pathname === item.link;
                    return (
                        <Link 
                            key={item.name} 
                            to={item.link}
                            className="group relative flex flex-col items-center w-full"
                        >
                            <motion.div 
                                initial={false}
                                animate={{
                                    scale: isActive ? 1.2 : 1,
                                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0)',
                                    color: isActive ? '#00cccc' : 'rgba(255, 255, 255, 0.2)',
                                    borderColor: isActive ? 'rgba(0, 204, 204, 0.4)' : 'rgba(255, 255, 255, 0.05)'
                                }}
                                whileHover={{ scale: 1.25, color: '#ffb300', borderColor: 'rgba(255, 179, 0, 0.4)' }}
                                className={`w-15 h-15 rounded-[22px] border flex items-center justify-center transition-all shadow-4xl group-hover:bg-white/5 bg-white/[0.02] backdrop-blur-3xl relative overflow-hidden`}
                            >
                                <div className="z-10">{item.icon}</div>
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </motion.div>
                            
                            {/* Augmented Telemetry Label */}
                            <motion.div 
                                className="absolute left-[90px] px-8 py-5 bg-[#0a0a0a] border border-white/10 text-white rounded-[30px] pointer-events-none opacity-0 translate-x-10 group-hover:opacity-100 group-hover:translate-x-0 transition-all shadow-4xl z-[150] whitespace-nowrap backdrop-blur-3xl italic"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="text-left">
                                        <p className="font-['Noto_Sans_Telugu'] text-xl font-black text-hospital-primary mb-1 tracking-tighter leading-none">{item.telugu}</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-px bg-white/20"></div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-700 leading-none">Node: {item.name}</p>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-hospital-secondary"><Zap size={14}/></div>
                                </div>
                                <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-4 h-4 bg-[#0a0a0a] border-l border-b border-white/10 rotate-45"></div>
                            </motion.div>

                            {isActive && (
                                <>
                                    <motion.div 
                                        layoutId="nav-bg-glow"
                                        className="absolute -inset-4 bg-hospital-primary/5 rounded-[35px] border border-white/5 blur-[4px] -z-10"
                                    />
                                    <div className="absolute -left-1 w-1.5 h-10 bg-hospital-primary rounded-full shadow-neon-primary animate-pulse-soft"></div>
                                </>
                            )}
                        </Link>
                    )
                })}
            </div>

            {/* Vital Uplink Connector */}
            <div className="mt-auto space-y-10 pt-10 border-t border-white/5 w-full flex flex-col items-center relative z-20">
                <div className="grid gap-8">
                     <a href="tel:+919948076665" className="w-15 h-15 rounded-[22px] bg-white/5 border border-white/10 flex items-center justify-center text-hospital-secondary hover:bg-hospital-secondary hover:text-black transition-all shadow-4xl group relative hover:scale-110 active:scale-90">
                        <HeartPulse size={24} className="group-hover:animate-ping" />
                        <div className="absolute inset-0 bg-hospital-secondary opacity-0 group-hover:opacity-10 blur-xl transition-opacity"></div>
                    </a>
                    
                    {!isMainPage ? (
                        <button onClick={() => navigate(-1)} className="w-15 h-15 rounded-[22px] bg-white/5 border border-white/10 flex items-center justify-center text-gray-700 hover:text-white hover:bg-white/10 transition-all shadow-4xl hover:border-white/20 active:scale-95 italic">
                            <ArrowLeft size={24} />
                        </button>
                    ) : (
                        <div className="w-15 h-15 rounded-[22px] bg-white/5 border border-white/10 flex items-center justify-center text-white/5 italic select-none">
                            <ShieldCheck size={22} />
                        </div>
                    )}
                </div>
            </div>
            
            {/* Background Medical Decor */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-[0.02] text-white pointer-events-none scale-150 rotate-12 z-0"><Activity size={80}/></div>
        </div>
    );

    const BottomNavigator = () => (
        <div className="fixed bottom-8 left-8 right-8 h-22 bg-[#0a0a0a] border border-white/20 shadow-4xl rounded-[40px] z-[150] flex items-center justify-around px-10 relative overflow-hidden backdrop-blur-3xl lg:hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-20"></div>
            {navItems.map((item) => {
                const isActive = location.pathname === item.link;
                return (
                    <Link key={item.name} to={item.link} className="flex flex-col items-center gap-2 group/mobile relative">
                        <motion.div 
                            animate={{ 
                                color: isActive ? '#00cccc' : 'rgba(255, 255, 255, 0.2)',
                                scale: isActive ? 1.4 : 1 
                            }}
                            className={`p-2 transition-all relative z-10 ${isActive ? 'bg-white/5 rounded-2xl shadow-neon-primary' : ''}`}
                        >
                            {item.icon}
                        </motion.div>
                        {isActive && <div className="absolute -bottom-2 w-1.5 h-1.5 rounded-full bg-hospital-primary shadow-neon-primary"></div>}
                    </Link>
                )
            })}
        </div >
    );

    return (
        <>
            {/* Desktop Architectural Side Rail */}
            <div className="fixed top-0 left-0 bottom-0 w-[140px] z-[200] hidden lg:block p-8 pointer-events-none">
                <div className="h-full bg-[#0a0a0a] border border-white/10 rounded-[60px] shadow-4xl pointer-events-auto relative overflow-hidden group">
                     {/* Ambient Pulse Light */}
                     <div className="absolute -top-20 -left-20 w-40 h-40 bg-hospital-primary/10 rounded-full blur-[80px] pointer-events-none group-hover:opacity-20 transition-opacity"></div>
                     <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-hospital-secondary/10 rounded-full blur-[80px] pointer-events-none group-hover:opacity-20 transition-opacity"></div>
                     <SidebarContent />
                </div>
            </div>
            
            {/* Mobile Navigation Interface */}
            <div className="lg:hidden">
                <BottomNavigator />
            </div>

            {/* Backplane Control (Mobile Only) */}
            {!isMainPage && (
                <div className="lg:hidden fixed top-8 left-8 z-[150]">
                    <button onClick={() => navigate(-1)} className="w-16 h-16 rounded-[28px] bg-[#0a0a0a] border border-white/20 flex items-center justify-center text-white shadow-4xl active:scale-95 transition-all backdrop-blur-3xl group relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <ArrowLeft size={28} className="relative z-10" />
                    </button>
                </div>
            )}
        </>
    );
};

export default Navbar;
