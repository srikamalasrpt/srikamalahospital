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
                <div className={`relative liquid-glass rounded-[40px] px-8 py-4 flex items-center justify-between border border-white/10 shadow-4xl backdrop-blur-3xl transition-all ${scrolled ? 'bg-black/80' : 'bg-white/5'}`}>
                    
                    {/* Logo Cluster */}
                    <Link to="/" className="flex items-center gap-4 group">
                        <div className="w-12 h-12 bg-white/10 p-2.5 rounded-2xl border border-white/10 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-2xl relative overflow-hidden">
                             <div className="absolute inset-0 bg-white group-hover:opacity-0 transition-opacity"></div>
                             <img src="/logo.png" alt="Sri Kamala" className="w-full h-full object-contain relative z-10" />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-xl font-black text-white leading-none font-['Noto_Sans_Telugu'] tracking-tighter group-hover:text-hospital-primary transition-colors">శ్రీ కమల <span className="text-hospital-secondary italic">హాస్పిటల్</span></h1>
                            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-500 mt-1.5 opacity-60">Integrated Clinical Hub</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-6">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.link;
                            return (
                                <Link 
                                    key={item.name} 
                                    to={item.link} 
                                    className="group relative flex flex-col items-center"
                                >
                                    <div className={`flex flex-col items-center transition-all px-4 py-2 rounded-2xl ${isActive ? 'bg-white/5 border border-white/10' : 'hover:bg-white/5'}`}>
                                        <span className={`font-['Noto_Sans_Telugu'] text-lg font-black leading-none mb-1 transition-colors ${isActive ? 'text-hospital-primary' : 'text-white/80 group-hover:text-white'}`}>
                                            {item.telugu}
                                        </span>
                                        <span className={`text-[8px] font-black uppercase tracking-widest leading-none italic transition-opacity ${isActive ? 'text-hospital-secondary opacity-100' : 'text-gray-600 opacity-40 group-hover:opacity-100'}`}>
                                            {item.name}
                                        </span>
                                    </div>
                                    {isActive && (
                                        <motion.div 
                                            layoutId="nav-underline"
                                            className="absolute -bottom-2 w-1.5 h-1.5 rounded-full bg-hospital-primary shadow-neon-primary"
                                        />
                                    )}
                                </Link>
                            )
                        })}
                    </div>

                    {/* Actions & Mobile Trigger */}
                    <div className="flex items-center gap-4">
                        <a href="tel:+919948076665" className="hidden md:flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-hospital-secondary hover:bg-hospital-secondary hover:text-black transition-all shadow-4xl group">
                            <HeartPulse size={18} className="group-hover:animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest italic">Emergency Hotlink</span>
                        </a>
                        
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 active:scale-90 transition-all"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
                        className="lg:hidden absolute top-[100%] left-6 right-6 mt-4 p-8 bg-black/95 border border-white/10 rounded-[40px] shadow-4xl backdrop-blur-3xl z-[400]"
                    >
                        <div className="grid grid-cols-2 gap-6">
                            {navItems.map((item) => (
                                <Link 
                                    key={item.name} 
                                    to={item.link} 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex flex-col items-center p-6 bg-white/5 border border-white/5 rounded-3xl hover:border-hospital-primary transition-all group"
                                >
                                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-hospital-primary mb-3">{item.icon}</div>
                                    <span className="font-['Noto_Sans_Telugu'] text-xl font-black text-white mb-1">{item.telugu}</span>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">{item.name}</span>
                                </Link>
                            ))}
                        </div>
                        <div className="mt-8 pt-8 border-t border-white/5">
                            <a href="tel:+919948076665" className="w-full flex items-center justify-center gap-4 p-6 bg-hospital-secondary text-black rounded-3xl font-black text-xs uppercase tracking-widest shadow-neon-secondary">
                                <HeartPulse size={20} /> CALL EMERGENCY HUB
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
