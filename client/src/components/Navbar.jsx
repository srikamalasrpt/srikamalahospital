import React, { useState } from 'react';
import { Home, Calendar, Users, FlaskConical, ShoppingBag, Activity, ChevronRight, Menu, X, ArrowLeft, HeartPulse, Sparkles, Orbit } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const navItems = [
        { name: 'Home', link: '/', telugu: 'హోమ్', icon: <Home size={18} /> },
        { name: 'Book', link: '/book', telugu: 'బుకింగ్', icon: <Calendar size={18} /> },
        { name: 'Doctors', link: '/doctors', telugu: 'వైద్యులు', icon: <Users size={18} /> },
        { name: 'Diagnosis', link: '/diagnosis', telugu: 'పరీక్షలు', icon: <FlaskConical size={18} /> },
        { name: 'Pharmacy', link: '/medical-shop', telugu: 'మందులు', icon: <ShoppingBag size={18} /> },
        { name: 'AI Health', link: '/ai-health', telugu: 'AI హెల్త్', icon: <Activity size={18} /> }
    ];

    const isMainPage = location.pathname === '/';

    const SidebarContent = () => (
        <div className="h-full flex flex-col items-center py-10 px-4 relative overflow-hidden">
            
            {/* Liquid Background Accents */}
            <div className="absolute top-1/4 -left-10 w-24 h-24 bg-hospital-primary/10 rounded-full blur-2xl animate-pulse-soft"></div>
            <div className="absolute bottom-1/4 -right-10 w-20 h-20 bg-hospital-secondary/10 rounded-full blur-2xl animate-pulse-soft" style={{ animationDelay: '3s' }}></div>

            {/* Identity Cluster */}
            <Link to="/" className="mb-16 group relative">
                <motion.div 
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="w-14 h-14 glass-organic flex items-center justify-center p-2 relative z-10"
                >
                    <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                </motion.div>
                <div className="absolute inset-0 bg-hospital-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>

            {/* Navigation Matrix */}
            <div className="flex-1 flex flex-col gap-8 items-center w-full">
                {navItems.map((item, i) => {
                    const isActive = location.pathname === item.link;
                    return (
                        <Link 
                            key={item.name} 
                            to={item.link}
                            className="group relative flex flex-col items-center gap-1 w-full"
                        >
                            <motion.div 
                                initial={false}
                                animate={{
                                    scale: isActive ? 1.2 : 1,
                                    backgroundColor: isActive ? 'rgba(0, 128, 128, 1)' : 'rgba(255, 255, 255, 0)',
                                    color: isActive ? '#fff' : 'rgba(15, 23, 42, 0.4)'
                                }}
                                whileHover={{ scale: 1.2, color: isActive ? '#fff' : 'var(--hospital-primary)' }}
                                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm border border-transparent group-hover:border-hospital-primary/20 ${isActive ? 'shadow-neon-primary' : ''}`}
                            >
                                {item.icon}
                            </motion.div>
                            
                            {/* Hover Reveal Title */}
                            <motion.div 
                                className="absolute left-16 px-4 py-2 bg-hospital-dark text-white rounded-xl text-[10px] font-black uppercase tracking-widest pointer-events-none opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all shadow-2xl z-50 whitespace-nowrap"
                            >
                                <p className="font-['Noto_Sans_Telugu'] text-xs mb-0.5">{item.telugu}</p>
                                <p className="opacity-40 text-[7px]">{item.name}</p>
                                <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-hospital-dark rotate-45"></div>
                            </motion.div>

                            {isActive && (
                                <motion.div 
                                    layoutId="nav-glow"
                                    className="absolute -inset-2 bg-hospital-primary/5 rounded-[24px] blur-md -z-10"
                                />
                            )}
                        </Link>
                    )
                })}
            </div>

            {/* Support Core */}
            <div className="mt-auto space-y-6">
                <a href="tel:+919948076665" className="w-12 h-12 rounded-2xl liquid-glass flex items-center justify-center text-hospital-secondary hover:text-white hover:bg-hospital-secondary transition-all shadow-lg group">
                    <HeartPulse size={20} className="group-hover:animate-pulse" />
                </a>
                {!isMainPage && (
                    <button onClick={() => navigate(-1)} className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 hover:text-hospital-dark hover:bg-gray-200 transition-all shadow-sm">
                        <ArrowLeft size={18} />
                    </button>
                )}
            </div>
        </div>
    );

    const BottomBar = () => (
        <div className="fixed bottom-0 left-0 w-full h-20 liquid-glass z-[100] border-t flex items-center justify-around px-4 lg:hidden rounded-t-[32px] shadow-2xl">
            {navItems.map((item) => {
                const isActive = location.pathname === item.link;
                return (
                    <Link key={item.name} to={item.link} className="flex flex-col items-center gap-1 group">
                        <motion.div 
                            animate={{ 
                                color: isActive ? 'var(--hospital-primary)' : 'rgba(15, 23, 42, 0.4)',
                                scale: isActive ? 1.2 : 1 
                            }}
                            className={`p-2 transition-all ${isActive ? 'bg-hospital-primary/10 rounded-xl' : ''}`}
                        >
                            {item.icon}
                        </motion.div>
                        <span className={`text-[7px] font-black uppercase tracking-widest transition-all ${isActive ? 'text-hospital-primary' : 'text-gray-300'}`}>{item.name}</span>
                    </Link>
                )
            })}
        </div>
    );

    return (
        <>
            <div className="sidebar-container sidebar-layout hidden lg:block !bg-transparent pointer-events-none">
                <div className="w-[110px] h-full p-4 pointer-events-auto">
                    <div className="h-full liquid-glass !rounded-[48px] overflow-hidden border-2 border-white/60 shadow-neon-primary">
                        <SidebarContent />
                    </div>
                </div>
            </div>
            
            <div className="lg:hidden">
                <BottomBar />
            </div>

            {/* Floating Mobile Header */}
            {!isMainPage && (
                <div className="lg:hidden fixed top-4 left-4 z-[110]">
                    <button onClick={() => navigate(-1)} className="w-12 h-12 rounded-2xl liquid-glass border-2 border-white/60 flex items-center justify-center text-hospital-dark shadow-xl hover:scale-110 active:scale-95 transition-all">
                        <ArrowLeft size={20} />
                    </button>
                </div>
            )}
        </>
    );
};

export default Navbar;
