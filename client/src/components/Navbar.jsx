import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, User, LogIn, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', link: '/', telugu: 'హోమ్' },
    { name: 'Book', link: '/book', telugu: 'బుకింగ్' },
    { name: 'Doctors', link: '/doctors', telugu: 'వైద్యులు' },
    { name: 'Diagnosis', link: '/diagnosis', telugu: 'పరీక్షలు' },
    { name: 'Pharmacy', link: '/medical-shop', telugu: 'మందులు' },
    { name: 'AI Health', link: '/ai-health', telugu: 'AI హెల్త్' }
  ];

  return (
    <nav className={`fixed w-full z-[100] transition-all duration-700 px-4 md:px-8 py-2 ${isScrolled ? 'top-0' : 'top-2'}`}>
      <div className={`container mx-auto max-w-7xl glass-card px-5 py-2 flex justify-between items-center ${isScrolled ? '!rounded-full !bg-white/95 border-white/60 shadow-lg' : ''}`}>
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-hospital-primary/10 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-all duration-500 overflow-hidden border border-hospital-primary/20 p-1">
             <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight text-hospital-dark leading-none font-['Noto_Sans_Telugu']">
              శ్రీ కమల <span className="text-hospital-primary">హాస్పిటల్</span>
            </h1>
            <p className="text-[7px] uppercase font-bold tracking-[0.2em] text-hospital-secondary leading-none mt-1">SRI KAMALA HOSPITAL</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.link} 
              className={`flex flex-col items-center transition-all duration-300 relative group
                ${location.pathname === item.link ? 'text-hospital-primary' : 'text-gray-400 hover:text-hospital-dark'}`}
            >
              <span className="text-base font-black font-['Noto_Sans_Telugu'] leading-none">{item.telugu}</span>
              <span className="text-[7px] font-bold uppercase tracking-widest opacity-40 group-hover:opacity-100">{item.name}</span>
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-hospital-primary transition-all duration-500 rounded-full
                ${location.pathname === item.link ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-2">
          <a href="tel:+919154404051" className="premium-button bg-hospital-secondary text-white px-4 py-2 border-none shadow-md">
            <Phone size={12} /> <span className="uppercase text-[9px] tracking-wider">+91 91544</span>
          </a>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(true)} className="lg:hidden p-1.5 text-hospital-dark hover:bg-gray-100 rounded-lg transition-all">
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="fixed inset-0 bg-hospital-dark/40 backdrop-blur-sm z-[110]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed top-0 right-0 h-full w-[280px] bg-white z-[120] shadow-2xl p-6 flex flex-col">
               <div className="flex justify-between items-center mb-8">
                  <div className="w-10 h-10 p-1 bg-gray-50 rounded-xl border border-gray-100"><img src="/logo.png" className="w-full h-full object-contain" /></div>
                  <button onClick={() => setIsOpen(false)} className="p-2 bg-gray-100 rounded-full hover:rotate-90 transition-all duration-500"><X size={18} /></button>
               </div>
               
               <div className="space-y-4">
                  {navItems.map((item, i) => (
                    <motion.div key={item.name} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}>
                       <Link to={item.link} onClick={() => setIsOpen(false)} className="flex items-center justify-between py-2 group">
                          <div className="flex flex-col">
                             <span className="text-xl font-black text-hospital-dark font-['Noto_Sans_Telugu']">{item.telugu}</span>
                             <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{item.name}</span>
                          </div>
                          <ChevronRight className="text-gray-200 group-hover:translate-x-2 group-hover:text-hospital-primary transition-all" size={16} />
                       </Link>
                    </motion.div>
                  ))}
               </div>

               <div className="mt-auto pt-6 border-t border-gray-100">
                  <p className="text-center text-[8px] font-bold text-gray-300 uppercase tracking-widest">Sri Kamala © 2026</p>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
