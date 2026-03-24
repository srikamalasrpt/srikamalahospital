import React, { useState, useEffect } from 'react';
import { Home, Calendar, Users, FlaskConical, ShoppingBag, Activity, ChevronRight, Menu, X, ArrowLeft, HeartPulse, Sparkles, Orbit, Plus, Droplets, Scissors, Pill, Syringe, Zap, ShieldCheck } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: 'Home', link: '/', telugu: 'హోమ్', icon: <Home size={18} /> },
        { name: 'Book', link: '/book', telugu: 'బుకింగ్', icon: <Calendar size={18} /> },
        { name: 'Doctors', link: '/doctors', telugu: 'వైద్యులు', icon: <Users size={18} /> },
        { name: 'Diagnosis', link: '/diagnosis', telugu: 'పరీక్షలు', icon: <FlaskConical size={18} /> },
        { name: 'Pharmacy', link: '/medical-shop', telugu: 'మందులు', icon: <ShoppingBag size={18} /> },
        { name: 'AI Health', link: '/ai-health', telugu: 'AI హెల్త్', icon: <Activity size={18} /> }
    ];

    const isMainPage = location.pathname === '/';

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[500] transition-all duration-500 ${scrolled ? 'py-4' : 'py-8'}`}>
            <div className="container mx-auto px-6 max-w-7xl">
                <div className={`relative liquid-glass rounded-[40px] px-8 py-4 flex items-center justify-between border border-black/5 shadow-xl backdrop-blur-3xl transition-all ${scrolled ? 'bg-white/95 border-hospital-primary/10' : 'bg-white/40'}`}>
                    
                    {/* Logo Cluster */}
                    <Link to="/" className="flex items-center gap-4 group">
                        <div className="w-11 h-11 bg-white p-2 rounded-2xl border border-black/5 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-xl relative overflow-hidden">
                             <img src="/logo.png" alt="Sri Kamala" className="w-full h-full object-contain relative z-10" />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-xl font-black text-slate-900 leading-none font-['Noto_Sans_Telugu'] tracking-tighter group-hover:text-hospital-primary transition-colors">శ్రీ కమల <span className="text-hospital-secondary italic">హాస్పిటల్</span></h1>
                            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400 mt-1.5 opacity-60">Integrated Clinical Hub</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-3">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.link;
                            return (
                                <Link 
                                    key={item.name} 
                                    to={item.link} 
                                    className="group relative flex flex-col items-center animated-button"
                                >
                                    <div className={`flex flex-col items-center transition-all px-4 py-2 rounded-xl ${isActive ? 'bg-slate-100/50 border border-black/5 shadow-inner' : 'hover:bg-slate-100/30'}`}>
                                        <span className={`font-['Noto_Sans_Telugu'] text-[15px] font-black leading-none mb-1 transition-colors ${isActive ? 'text-hospital-primary' : 'text-slate-600 group-hover:text-slate-900'}`}>
                                            {item.telugu}
                                        </span>
                                        <span className={`text-[7px] font-black uppercase tracking-widest leading-none italic transition-opacity ${isActive ? 'text-hospital-secondary opacity-100' : 'text-slate-400 opacity-40 group-hover:opacity-100'}`}>
                                            {item.name}
                                        </span>
                                    </div>
                                    {isActive && (
                                        <motion.div 
                                            layoutId="nav-underline"
                                            className="absolute -bottom-1 w-1 h-1 rounded-full bg-hospital-primary shadow-neon-primary"
                                        />
                                    )}
                                </Link>
                            )
                        })}
                    </div>
 
                    {/* Actions & Mobile Trigger */}
                    <div className="flex items-center gap-3">
                        <a href="tel:+919948076665" className="animated-button hidden md:flex items-center gap-2 px-5 py-2.5 bg-slate-900 border border-black/5 rounded-full text-white hover:bg-hospital-secondary transition-all shadow-xl group">
                            <HeartPulse size={14} className="group-hover:animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-widest italic">Emergency Hotlink</span>
                        </a>
                        
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden w-11 h-11 rounded-2xl bg-white border border-black/5 flex items-center justify-center text-slate-900 hover:bg-slate-50 transition-all shadow-lg"
                        >
                            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="lg:hidden absolute top-[100%] left-6 right-6 mt-4 p-8 bg-white border border-black/5 rounded-[40px] shadow-4xl z-[400]"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            {navItems.map((item) => (
                                <Link 
                                    key={item.name} 
                                    to={item.link} 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex flex-col items-center p-6 bg-slate-50/50 border border-black/5 rounded-3xl hover:border-hospital-primary transition-all group"
                                >
                                    <div className="w-10 h-10 bg-white border border-black/5 rounded-xl flex items-center justify-center text-hospital-primary mb-3 shadow-md">{item.icon}</div>
                                    <span className="font-['Noto_Sans_Telugu'] text-xl font-black text-slate-900 mb-1">{item.telugu}</span>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{item.name}</span>
                                </Link>
                            ))}
                        </div>
                        <div className="mt-6 pt-6 border-t border-slate-100">
                            <a href="tel:+919948076665" className="w-full flex items-center justify-center gap-4 p-5 bg-[#0f172a] text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-xl">
                                <HeartPulse size={18} /> CALL EMERGENCY HUB
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
