import React from 'react';
import { Phone, MapPin, ShieldCheck, Award, Heart, Lock, FileText, HelpCircle, ArrowUpRight, Plus, Sparkles, Orbit } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-[#0a0a0a] pt-32 pb-16 px-6 relative overflow-hidden text-white font-sans selection:bg-hospital-primary selection:text-white">
            
            {/* Holographic Accents */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-hospital-primary/10 rounded-full blur-[140px] pointer-events-none animate-pulse-soft"></div>
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-hospital-secondary/10 rounded-full blur-[120px] pointer-events-none animate-pulse-soft" style={{ animationDelay: '2s' }}></div>

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
                    
                    {/* Brand Section - High Fidelity */}
                    <div className="space-y-10">
                        <Link to="/" className="flex flex-col gap-6 group">
                           <div className="w-16 h-16 p-4 bg-white/5 backdrop-blur-3xl rounded-[24px] border border-white/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-neon-primary relative overflow-hidden">
                              <div className="absolute inset-0 bg-white group-hover:opacity-0 transition-opacity"></div>
                              <img src="/logo.png" className="w-full h-full object-contain relative z-10" />
                           </div>
                           <div>
                               <h2 className="text-2xl font-black tracking-tighter leading-none text-white font-['Noto_Sans_Telugu'] mb-3 group-hover:text-hospital-primary transition-colors">శ్రీ కమల <span className="text-hospital-secondary italic font-serif">హాస్పిటల్</span></h2>
                               <p className="text-[10px] uppercase font-bold tracking-[0.5em] text-hospital-primary opacity-60">SRI KAMALA HOSPITAL</p>
                           </div>
                        </Link>
                        <p className="text-gray-500 text-xs font-medium leading-relaxed max-w-sm italic">
                           Integrated Clinical Ecosystem in Suryapet. Advancing healthcare through precision diagnostic intelligence and humanitarian medicine.
                        </p>
                        <div className="flex gap-4">
                           <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-hospital-primary hover:bg-white/10 transition-all cursor-pointer"><Orbit size={18} /></div>
                           <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-hospital-secondary hover:bg-white/10 transition-all cursor-pointer"><Sparkles size={18} /></div>
                        </div>
                    </div>

                    {/* Navigation - High End Link Matrix */}
                    <div className="space-y-10">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-white/40 border-l-2 border-hospital-secondary pl-4">Digital Matrix</h4>
                        <div className="grid grid-cols-1 gap-5">
                            {[
                                { n: 'About Ecosystem', t: 'గురించి', to: '/info/about' },
                                { n: 'Elite Panel Specialists', t: 'వైద్యులు', to: '/doctors' },
                                { n: 'Clinical Apothecary', t: 'షాపు', to: '/medical-shop' },
                                { n: 'Molecular Diagnostics', t: 'పరీక్షలు', to: '/diagnosis' },
                                { n: 'Reserve Appointment', t: 'బుకింగ్', to: '/book' },
                                { n: 'AI Verification Core', t: 'AI హెల్త్', to: '/ai-health' }
                            ].map((item, i) => (
                                <Link key={i} to={item.to} className="group flex items-center gap-4 transition-all">
                                   <div className="w-1 h-3 bg-white/5 group-hover:bg-hospital-primary group-hover:h-5 transition-all rounded-full"></div>
                                   <div className="flex flex-col">
                                       <span className="font-['Noto_Sans_Telugu'] text-xl font-black tracking-normal group-hover:text-hospital-secondary transition-colors mb-0.5">{item.t}</span>
                                       <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 opacity-60 group-hover:opacity-100">{item.n}</span>
                                   </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Contact - Precision Logistics */}
                    <div className="space-y-10">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-white/40 border-l-2 border-hospital-primary pl-4">Clinical Logistics</h4>
                        <div className="space-y-8">
                            <div className="flex gap-5 group">
                               <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-hospital-primary border border-white/5 group-hover:scale-110 transition-all shadow-neon-primary"><MapPin size={20} /></div>
                               <div className="flex-1 select-all"><p className="text-sm font-black text-gray-200 font-['Noto_Sans_Telugu'] mb-1">మహాత్మా గాంధీ రోడ్డు, సూర్యాపేట</p><p className="text-[9px] uppercase font-black tracking-[0.3em] text-gray-500">M.G. Road Corridor, Suryapet DT</p></div>
                            </div>
                            <div className="flex gap-5 group cursor-pointer" onClick={() => window.open('tel:+919948076665')}>
                               <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-hospital-primary border border-white/5 group-hover:scale-110 transition-all shadow-neon-primary"><Phone size={20} /></div>
                               <div><p className="text-xl font-black text-white tracking-widest leading-none mb-1">+91 99480 76665</p><p className="text-[9px] font-black uppercase tracking-[0.3em] text-hospital-primary opacity-60 italic">Emergency Core Hub (24/7)</p></div>
                            </div>
                            <div className="flex gap-5 group cursor-pointer" onClick={() => window.open('tel:+919866895634')}>
                               <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-hospital-secondary border border-white/5 group-hover:scale-110 transition-all shadow-neon-secondary"><Plus size={20} /></div>
                               <div><p className="text-xl font-black text-white tracking-widest leading-none mb-1">+91 98668 95634</p><p className="text-[9px] font-black uppercase tracking-[0.3em] text-hospital-secondary opacity-60 italic">Laboratory Operations</p></div>
                            </div>
                        </div>
                    </div>

                    {/* Legal Flow */}
                    <div className="space-y-10">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-white/40 border-l-2 border-hospital-primary pl-4">Security Protocol</h4>
                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { icon: <Lock size={16} />, label: 'Data Security', to: '/info/security' },
                                { icon: <ShieldCheck size={16} />, label: 'Privacy Core', to: '/info/privacy-policy' },
                                { icon: <FileText size={16} />, label: 'Clinical Terms', to: '/info/terms' },
                                { icon: <HelpCircle size={16} />, label: 'Resolution FAQ', to: '/info/faq' }
                            ].map((link, i) => (
                                <Link key={i} to={link.to} className="flex items-center justify-between p-5 bg-white/5 rounded-[24px] border border-white/5 hover:bg-white/10 hover:border-hospital-primary transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="text-gray-500 group-hover:text-hospital-secondary transition-colors">{link.icon}</div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 group-hover:text-white transition-colors">{link.label}</span>
                                    </div>
                                    <ArrowUpRight size={14} className="text-white/10 group-hover:text-hospital-primary transition-all" />
                                </Link>
                            ))}
                        </div>
                    </div>

                </div>

                <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] mb-2 leading-none">© 2026 SRI KAMALA INTEGRATED SYSTEMS. ALL RIGHTS RESERVED.</p>
                        <p className="text-[8px] font-bold text-gray-700 tracking-[0.8em]">ENGINEERED BY CHAMA · NEXT-GEN MED TECH HUB</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 text-hospital-primary">
                            <Heart size={14} fill="currentColor" className="animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-[0.4em]">Life Preservations Logic</span>
                        </div>
                        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center opacity-20 hover:opacity-100 transition-opacity cursor-pointer">
                            <Plus size={16} />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
