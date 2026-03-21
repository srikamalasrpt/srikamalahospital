import React from 'react';
import { Phone, MapPin, ShieldCheck, Award, Heart, Lock, FileText, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-hospital-dark pt-20 pb-10 px-6 relative overflow-hidden text-white font-sans">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.2]"></div>
            
            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-3">
                           <div className="w-10 h-10 p-1 bg-white rounded-xl"><img src="/logo.png" className="w-full h-full object-contain" /></div>
                           <div>
                               <h2 className="text-base font-black tracking-tight leading-none text-white font-['Noto_Sans_Telugu']">శ్రీ కమల హాస్పిటల్</h2>
                               <p className="text-[7px] uppercase font-bold tracking-[0.3em] text-hospital-primary mt-1">SRI KAMALA HOSPITAL</p>
                           </div>
                        </Link>
                        <p className="text-gray-400 text-xs font-medium leading-relaxed max-w-sm">
                           Reliable diagnostics and advanced healthcare in Suryapet. Open 24 hours for emergency and diagnostic labs.
                        </p>
                    </div>

                    {/* Navigation Quicklinks */}
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-hospital-secondary text-sm">త్వరిత నావిగేషన్</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { n: 'About', t: 'గురించి', to: '/info/about' },
                                { n: 'Doctors', t: 'వైద్యులు', to: '/doctors' },
                                { n: 'Shop', t: 'షాపు', to: '/medical-shop' },
                                { n: 'Tests', t: 'పరీక్షలు', to: '/diagnosis' },
                                { n: 'Booking', t: 'బుకింగ్', to: '/book' },
                                { n: 'Reviews', t: 'సమీక్షలు', to: '/reviews' }
                            ].map((item, i) => (
                                <Link key={i} to={item.to} className="text-[10px] font-bold text-gray-400 hover:text-white transition-all flex flex-col uppercase tracking-widest group">
                                   <span className="font-['Noto_Sans_Telugu'] text-xs font-black tracking-normal lowercase group-hover:text-hospital-primary">{item.t}</span>
                                   <span className="opacity-40">{item.n}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Contact Info Grid */}
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-hospital-secondary text-sm">సంప్రదించండి</h4>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                               <div className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center text-hospital-primary"><MapPin size={16} /></div>
                               <div><p className="text-[10px] font-bold text-gray-300 font-['Noto_Sans_Telugu'] uppercase">ఎదురుగా తిరుమల గ్రాండ్ రెస్టారెంట్, సూర్యాపేట</p><p className="text-[7px] uppercase font-black tracking-widest text-gray-500">Opp. Tirumala Grand, M.G. Road, Suryapet</p></div>
                            </div>
                            <div className="flex gap-3">
                               <div className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center text-hospital-primary"><Phone size={16} /></div>
                               <div><p className="text-[10px] font-bold text-gray-300">99480 76665</p><p className="text-[7px] uppercase font-black tracking-widest text-gray-500">Hospital OP / Emergency (24h)</p></div>
                            </div>
                            <div className="flex gap-3">
                               <div className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center text-hospital-secondary"><Phone size={16} /></div>
                               <div><p className="text-[10px] font-bold text-gray-300">98668 95634</p><p className="text-[7px] uppercase font-black tracking-widest text-gray-500">Kamala Diagnostics / Lab</p></div>
                            </div>
                        </div>
                    </div>

                    {/* Legal + Security Block */}
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-hospital-secondary text-sm">Legal & Security</h4>
                        <div className="space-y-3">
                           <Link to="/info/security" className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-hospital-primary/40 transition-all">
                               <Lock size={14} className="text-hospital-primary" />
                               <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Security</span>
                           </Link>
                           <Link to="/info/privacy-policy" className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-hospital-primary/40 transition-all">
                               <ShieldCheck size={14} className="text-hospital-secondary" />
                               <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Privacy Policy</span>
                           </Link>
                           <Link to="/info/terms" className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-hospital-primary/40 transition-all">
                               <FileText size={14} className="text-hospital-primary" />
                               <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Terms & Conditions</span>
                           </Link>
                           <Link to="/info/faq" className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-hospital-primary/40 transition-all">
                               <HelpCircle size={14} className="text-hospital-secondary" />
                               <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">FAQ</span>
                           </Link>
                           <Link to="/info/contact" className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-hospital-primary/40 transition-all">
                               <Phone size={14} className="text-hospital-primary" />
                               <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Contact Page</span>
                           </Link>
                           <Link to="/info/sitemap" className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-hospital-primary/40 transition-all">
                               <Award size={14} className="text-hospital-primary" />
                               <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Sitemap</span>
                           </Link>
                        </div>
                    </div>

                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">© 2026 SRI KAMALA HOSPITAL. ALL RIGHTS RESERVED. (DEV BY CHAMA)</p>
                    <div className="flex items-center gap-2 text-hospital-secondary opacity-50">
                        <Heart size={12} fill="currentColor" />
                        <span className="text-[8px] font-black uppercase tracking-widest">Healthcare Excellence</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
