import React, { useState, useEffect } from 'react';
import { Home, Calendar, Users, FlaskConical, ShoppingBag, Activity, ChevronRight, Menu, X, HeartPulse, Sparkles, Orbit, Plus, Droplets, Scissors, Pill, Syringe, Zap, ShieldCheck } from 'lucide-react';
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

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[500] transition-all duration-700 ${scrolled ? 'py-4' : 'py-8'}`}>
            <div className="container mx-auto px-6 max-w-7xl">
                <div className={`relative glass-panel px-8 py-3.5 flex items-center justify-between border border-white/40 shadow-premium transition-all duration-700 ${scrolled ? 'scale-95' : 'scale-100'}`}>
                    
                    {/* Logo Section */}
                    <Link to="/" className="flex items-center gap-4 group">
                        <div className="relative">
                            <div className="w-12 h-12 bg-hospital-dark p-2.5 rounded-2xl group-hover:rotate-[15deg] transition-all duration-500 shadow-2xl relative z-10 overflow-hidden">
                                 <img src="/logo.png" alt="Sri Kamala" className="w-full h-full object-contain relative z-10 brightness-200" />
                                 <div className="absolute inset-0 bg-gradient-to-br from-hospital-primary/20 to-transparent"></div>
                            </div>
                            <div className="absolute -inset-1 bg-hospital-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-black text-hospital-dark leading-none font-outfit uppercase tracking-tighter group-hover:text-hospital-primary transition-colors">
                                Sri Kamala <span className="text-hospital-primary italic">Hospital</span>
                            </h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="w-2 h-2 rounded-full bg-hospital-secondary animate-pulse"></span>
                                <p className="text-[8px] font-black uppercase tracking-[0.4em] text-hospital-slate/50">Integrated Hub</p>
                            </div>
                        </div>
                    </Link>

                    {/* Navigation Items (Desktop) */}
                    <div className="hidden lg:flex items-center gap-1.5 p-1.5 bg-hospital-surface/50 rounded-full border border-black/5">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.link;
                            return (
                                <Link 
                                    key={item.name} 
                                    to={item.link} 
                                    className="relative group"
                                >
                                    <div className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-500 flex items-center gap-2 ${isActive ? 'bg-white text-hospital-primary shadow-clinical' : 'text-hospital-slate hover:text-hospital-dark hover:bg-white/50'}`}>
                                        <span className="font-outfit text-[11px] uppercase tracking-widest">{item.name}</span>
                                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-hospital-primary shadow-glow"></div>}
                                    </div>
                                    {isActive && (
                                        <motion.div 
                                            layoutId="nav-bg"
                                            className="absolute inset-0 bg-white rounded-full -z-10 shadow-clinical"
                                        />
                                    )}
                                </Link>
                            )
                        })}
                    </div>
 
                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <Link to="/book" className="btn-clinical hidden md:flex h-12 px-8">
                            <span>Get Appointment</span>
                        </Link>
                        
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden w-12 h-12 rounded-2xl bg-hospital-dark text-white flex items-center justify-center hover:scale-105 transition-all shadow-xl"
                        >
                            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Navigation Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="lg:hidden absolute top-[100%] left-6 right-6 mt-4 p-8 glass-panel z-[400]"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            {navItems.map((item) => (
                                <Link 
                                    key={item.name} 
                                    to={item.link} 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex flex-col items-center p-6 bg-hospital-surface/50 border border-black/5 rounded-[2rem] hover:border-hospital-primary transition-all group"
                                >
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-hospital-primary mb-4 shadow-clinical">{item.icon}</div>
                                    <span className="font-outfit text-[10px] font-black uppercase tracking-widest text-hospital-dark">{item.name}</span>
                                </Link>
                            ))}
                        </div>
                        <div className="mt-8 pt-6 border-t border-black/5">
                            <a href="tel:+919948076665" className="btn-clinical w-full">
                                <span>Emergency Hub</span>
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
