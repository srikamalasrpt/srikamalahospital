import React, { useState, useEffect } from 'react';
import { Home, Calendar, Users, FlaskConical, ShoppingBag, Activity, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { telugu: 'హోమ్', english: 'Home', link: '/', icon: <Home size={14} /> },
        { telugu: 'బుకింగ్', english: 'Book', link: '/book', icon: <Calendar size={14} /> },
        { telugu: 'వైద్యులు', english: 'Doctors', link: '/doctors', icon: <Users size={14} /> },
        { telugu: 'పరీక్షలు', english: 'Diagnosis', link: '/diagnosis', icon: <FlaskConical size={14} /> },
        { telugu: 'ఫార్మసీ', english: 'Pharmacy', link: '/medical-shop', icon: <ShoppingBag size={14} /> },
        { telugu: 'AI ఆరోగ్యం', english: 'AI Health', link: '/ai-health', icon: <Activity size={14} /> }
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[500] transition-all duration-500 ${scrolled ? 'py-3' : 'py-6'}`}>
            <div className="container mx-auto px-4 max-w-5xl">
                <div className={`glass-panel px-6 py-2 flex items-center justify-between transition-all duration-500 ${scrolled ? 'rounded-2xl shadow-md' : 'rounded-3xl shadow-none border-transparent bg-transparent'}`}>
                    
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-8 h-8 bg-hospital-dark p-1.5 rounded-lg group-hover:rotate-6 transition-transform">
                             <img src="/logo.png" alt="Logo" className="w-full h-full object-contain brightness-200" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-black text-hospital-dark uppercase tracking-tighter leading-none group-hover:text-hospital-primary transition-colors font-['Noto_Sans_Telugu']">
                                శ్రీ కమల <span className="text-[9px] font-black uppercase text-hospital-dark/40 ml-1">Sri Kamala</span>
                            </span>
                            <span className="text-[9px] font-bold text-hospital-primary leading-none mt-1 font-['Noto_Sans_Telugu']">హాస్పిటల్ <span className="text-[7px] font-bold uppercase tracking-[0.2em] text-hospital-primary/40 ml-1">Hospital</span></span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.link;
                            return (
                                <Link 
                                    key={item.english} 
                                    to={item.link} 
                                    className={`px-3 py-1.5 rounded-lg transition-all duration-300 flex items-center gap-2 ${isActive ? 'bg-hospital-dark text-white' : 'text-hospital-slate hover:text-hospital-dark hover:bg-black/5'}`}
                                >
                                    <span className="font-['Noto_Sans_Telugu'] text-[11px] font-bold">{item.telugu} <span className="text-[8px] font-black uppercase tracking-widest opacity-40 ml-1">{item.english}</span></span>
                                </Link>
                            )
                        })}
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-3">
                        <Link to="/book" className="hidden md:block px-4 py-2 bg-hospital-primary text-white rounded-lg hover:bg-hospital-dark transition-all shadow-clinical group">
                            <span className="font-['Noto_Sans_Telugu'] text-[11px] font-bold">ఇప్పుడే బుక్ చేయండి <span className="text-[8px] font-black uppercase tracking-widest opacity-40 ml-1 group-hover:opacity-100">Book Now</span></span>
                        </Link>
                        
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 text-hospital-dark hover:bg-black/5 rounded-lg transition-all"
                        >
                            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="lg:hidden absolute top-[100%] left-4 right-4 mt-2 p-4 glass-panel border border-black/5"
                    >
                        <div className="grid grid-cols-2 gap-2">
                            {navItems.map((item) => (
                                <Link 
                                    key={item.english} 
                                    to={item.link} 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl transition-all border border-transparent hover:border-hospital-primary/20"
                                >
                                    <div className="text-hospital-primary">{item.icon}</div>
                                    <span className="font-['Noto_Sans_Telugu'] text-[11px] font-bold text-hospital-dark">{item.telugu} <span className="text-[8px] font-black uppercase tracking-widest opacity-40 ml-1">{item.english}</span></span>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
