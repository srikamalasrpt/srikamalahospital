import React from 'react';
import { Phone, MapPin, ShieldCheck, Award, Heart, Lock, FileText, HelpCircle, ArrowUpRight, Plus, Sparkles, Orbit, Scissors, Syringe, Droplets } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-black pt-40 pb-20 px-6 relative overflow-hidden text-white font-sans selection:bg-hospital-primary selection:text-black">
            
            {/* Holographic Accents - Enhanced for Midnight Theme */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-hospital-primary/10 rounded-full blur-[160px] pointer-events-none animate-pulse-soft"></div>
            <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-hospital-secondary/5 rounded-full blur-[140px] pointer-events-none animate-pulse-soft" style={{ animationDelay: '2s' }}></div>

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-32">
                    
                    {/* Brand Section - High Fidelity Clinical Core */}
                    <div className="space-y-12">
                        <Link to="/" className="flex flex-col gap-8 group">
                           <div className="w-20 h-20 p-5 bg-white/5 backdrop-blur-3xl rounded-[30px] border border-white/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-4xl relative overflow-hidden">
                              <div className="absolute inset-x-0 bottom-0 top-0 bg-white rounded-[28px] group-hover:opacity-0 transition-opacity"></div>
                              <img src="/logo.png" className="w-full h-full object-contain relative z-10" />
                           </div>
                           <div>
                               <h2 className="text-3xl font-black tracking-tighter leading-none text-white font-['Noto_Sans_Telugu'] mb-4 group-hover:text-hospital-primary transition-colors">శ్రీ కమల <span className="text-hospital-secondary italic font-serif">హాస్పిటల్</span></h2>
                               <p className="text-[11px] uppercase font-bold tracking-[0.6em] text-hospital-primary opacity-60">SRI KAMALA INTEGRATED HUB</p>
                           </div>
                        </Link>
                        <p className="text-gray-500 text-xs font-medium leading-relaxed max-w-sm italic font-serif">
                           "Deploying next-generation clinical intelligence and humanitarian precision medicine to the heart of Suryapet."
                        </p>
                        <div className="flex gap-5">
                           <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-hospital-primary hover:bg-hospital-primary hover:text-black transition-all cursor-pointer shadow-neon-primary"><Orbit size={20} /></div>
                           <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-hospital-secondary hover:bg-hospital-secondary hover:text-black transition-all cursor-pointer shadow-neon-secondary"><Sparkles size={20} /></div>
                        </div>
                    </div>

                    {/* Navigation - High End Link Matrix */}
                    <div className="space-y-12">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.8em] text-white/40 border-l-2 border-hospital-secondary pl-6">Digital Matrix</h4>
                        <div className="grid grid-cols-1 gap-6">
                            {[
                                { n: 'About Ecosystem', t: 'గురించి', to: '/info/about' },
                                { n: 'Elite Panel Specialists', t: 'వైద్యులు', to: '/doctors' },
                                { n: 'Clinical Apothecary', t: 'షాపు', to: '/medical-shop' },
                                { n: 'Molecular Diagnostics', t: 'పరీక్షలు', to: '/diagnosis' },
                                { n: 'Reserve Appointment', t: 'బుకింగ్', to: '/book' },
                                { n: 'AI Verification Core', t: 'AI హెల్త్', to: '/ai-health' }
                            ].map((item, i) => (
                                <Link key={i} to={item.to} className="group flex items-center gap-6 transition-all">
                                   <div className="w-1.5 h-4 bg-white/10 group-hover:bg-hospital-primary group-hover:h-8 transition-all rounded-full"></div>
                                   <div className="flex flex-col">
                                       <span className="font-['Noto_Sans_Telugu'] text-2xl font-black tracking-normal group-hover:text-hospital-secondary transition-colors mb-1">{item.t}</span>
                                       <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 opacity-60 group-hover:opacity-100 italic">{item.n}</span>
                                   </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Contact - Precision Logistics */}
                    <div className="space-y-12">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.8em] text-white/40 border-l-2 border-hospital-primary pl-6">Clinical Logistics</h4>
                        <div className="space-y-10">
                            <div className="flex gap-6 group">
                               <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-hospital-primary border border-white/10 group-hover:scale-110 transition-all shadow-4xl"><MapPin size={24} /></div>
                               <div className="flex-1 select-all"><p className="text-base font-black text-gray-200 font-['Noto_Sans_Telugu'] mb-1">మహాత్మా గాంధీ రోడ్డు, సూర్యాపేట</p><p className="text-[10px] uppercase font-black tracking-[0.4em] text-gray-600">M.G. Road Corridor, Suryapet DT</p></div>
                            </div>
                            <div className="flex gap-6 group cursor-pointer" onClick={() => window.open('tel:+919948076665')}>
                               <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-hospital-primary border border-white/10 group-hover:scale-110 transition-all shadow-4xl"><Phone size={24} /></div>
                               <div><p className="text-2xl font-black text-white tracking-widest leading-none mb-1">+91 99480 76665</p><p className="text-[10px] font-black uppercase tracking-[0.4em] text-hospital-primary opacity-60 italic">Emergency Core Hub (24/7)</p></div>
                            </div>
                            <div className="flex gap-6 group cursor-pointer" onClick={() => window.open('tel:+919866895634')}>
                               <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-hospital-secondary border border-white/10 group-hover:scale-110 transition-all shadow-4xl"><Plus size={24} /></div>
                               <div><p className="text-2xl font-black text-white tracking-widest leading-none mb-1">+91 98668 95634</p><p className="text-[10px] font-black uppercase tracking-[0.4em] text-hospital-secondary opacity-60 italic">Laboratory Operations</p></div>
                            </div>
                        </div>
                    </div>

                    {/* Legal Flow */}
                    <div className="space-y-12">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.8em] text-white/40 border-l-2 border-hospital-primary pl-6">Security Protocol</h4>
                        <div className="grid grid-cols-1 gap-6">
                            {[
                                { icon: <Lock size={18} />, label: 'Data Security', to: '/info/security' },
                                { icon: <ShieldCheck size={18} />, label: 'Privacy Core', to: '/info/privacy-policy' },
                                { icon: <FileText size={18} />, label: 'Clinical Terms', to: '/info/terms' },
                                { icon: <HelpCircle size={18} />, label: 'Resolution FAQ', to: '/info/faq' }
                            ].map((link, i) => (
                                <Link key={i} to={link.to} className="flex items-center justify-between p-6 bg-white/5 rounded-[30px] border border-white/5 hover:bg-white/10 hover:border-hospital-primary transition-all group backdrop-blur-3xl shadow-4xl">
                                    <div className="flex items-center gap-5">
                                        <div className="text-gray-600 group-hover:text-hospital-secondary transition-colors">{link.icon}</div>
                                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-500 group-hover:text-white transition-colors">{link.label}</span>
                                    </div>
                                    <ArrowUpRight size={16} className="text-white/10 group-hover:text-hospital-primary transition-all" />
                                </Link>
                            ))}
                        </div>
                    </div>

                </div>

                <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <p className="text-[11px] font-black text-gray-700 uppercase tracking-[0.5em] mb-2 leading-none">© 2026 SRI KAMALA INTEGRATED SYSTEMS. ALL RIGHTS RESERVED.</p>
                        <p className="text-[9px] font-bold text-gray-800 tracking-[1em] uppercase">Engineered by Chama · Next-Gen Digital Medical Ecosystem</p>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-4 text-hospital-primary">
                            <Heart size={16} fill="currentColor" className="animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.5em]">Global Life Preservation Logic</span>
                        </div>
                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center opacity-30 hover:opacity-100 hover:border-hospital-primary transition-all cursor-pointer">
                            <Plus size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Spatials */}
            <div className="absolute top-1/2 right-[5%] opacity-[0.02] text-white pointer-events-none"><Scissors size={180} /></div>
            <div className="absolute bottom-1/4 left-[5%] opacity-[0.02] text-hospital-secondary pointer-events-none"><Droplets size={160} /></div>
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 opacity-[0.01] text-white pointer-events-none"><Plus size={400} /></div>

        </footer>
    );
};

export default Footer;
