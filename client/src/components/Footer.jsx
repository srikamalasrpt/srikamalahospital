import React from 'react';
import { Phone, MapPin, ShieldCheck, Award, Heart, Lock, FileText, HelpCircle, ArrowUpRight, Plus, Sparkles, Orbit, Scissors, Syringe, Droplets, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white pt-40 pb-20 px-6 relative overflow-hidden text-hospital-dark grainy border-t border-black/5">

            {/* Clinical Accents */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-hospital-primary/20 to-transparent"></div>
            <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-hospital-primary/5 rounded-full blur-[160px] pointer-events-none animate-pulse-soft"></div>
            <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-hospital-secondary/5 rounded-full blur-[140px] pointer-events-none animate-pulse-soft" style={{ animationDelay: '2s' }}></div>

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-32">

                    {/* Brand Section */}
                    <div className="space-y-12">
                        <Link to="/" className="flex flex-col gap-10 group">
                            <div className="w-24 h-24 p-6 bg-white rounded-[2.5rem] border border-white/80 group-hover:scale-110 group-hover:rotate-[15deg] transition-all duration-700 shadow-premium relative overflow-hidden flex items-center justify-center">
                                <img src="/logo.png" className="w-full h-full object-contain relative z-10" alt="Logo" />
                                <div className="absolute inset-0 bg-gradient-to-br from-hospital-primary/5 to-transparent"></div>
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-4xl font-black tracking-tighter leading-none text-hospital-dark font-['Noto_Sans_Telugu'] group-hover:text-hospital-secondary transition-colors">శ్రీ కమల <span className="text-hospital-primary italic font-serif">హాస్పిటల్</span></h2>
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-hospital-secondary"></div>
                                    <p className="text-overline">SRI KAMALA INTEGRATED SYSTEMS</p>
                                </div>
                            </div>
                        </Link>
                        <p className="text-hospital-slate text-sm font-medium leading-relaxed max-w-sm italic font-serif">
                            "Deploying next-generation clinical intelligence and humanitarian precision medicine to the heart of Suryapet."
                        </p>
                        <div className="flex gap-5">
                            {[Orbit, Sparkles, Heart].map((Icon, idx) => (
                                <div key={idx} className="w-12 h-12 rounded-[1.2rem] bg-white border border-white/80 flex items-center justify-center text-hospital-primary hover:bg-hospital-primary hover:text-white transition-all cursor-pointer shadow-clinical hover:shadow-premium hover:-translate-y-1">
                                    <Icon size={20} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="space-y-12">
                        <h4 className="text-overline border-l-2 border-hospital-secondary pl-6">Digital Hub</h4>
                        <div className="grid grid-cols-1 gap-8">
                            {[
                                { n: 'About Ecosystem', t: 'గురించి', to: '/info/about' },
                                { n: 'Clinical Panel', t: 'వైద్యులు', to: '/doctors' },
                                { n: 'Smart Pharmacy', t: 'షాపు', to: '/medical-shop' },
                                { n: 'Lab Diagnostics', t: 'పరీక్షలు', to: '/diagnosis' },
                                { n: 'Book Appointment', t: 'బుకింగ్', to: '/book' },
                                { n: 'AI Health Core', t: 'AI హెల్త్', to: '/ai-health' }
                            ].map((item, i) => (
                                <Link key={i} to={item.to} className="group flex items-center gap-6 transition-all">
                                    <div className="w-1 h-5 bg-hospital-slate/10 group-hover:bg-hospital-primary group-hover:h-10 transition-all rounded-full"></div>
                                    <div className="flex flex-col">
                                        <span className="font-['Noto_Sans_Telugu'] text-2xl font-black tracking-normal group-hover:text-hospital-secondary transition-colors leading-none mb-2">{item.t}</span>
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-hospital-slate/40 group-hover:text-hospital-slate italic transition-colors">{item.n}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-12">
                        <h4 className="text-overline border-l-2 border-hospital-primary pl-6">Clinical Access</h4>
                        <div className="space-y-12">
                            <div className="flex gap-6 group">
                                <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center text-hospital-primary border border-white/80 group-hover:scale-110 group-hover:rotate-12 transition-all shadow-clinical group-hover:shadow-premium shrink-0">
                                    <MapPin size={28} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-lg font-black text-hospital-dark font-['Noto_Sans_Telugu'] leading-tight mb-2">మహాత్మా గాంధీ రోడ్డు, సూర్యాపేట</p>
                                    <p className="text-[10px] uppercase font-black tracking-[0.3em] text-hospital-slate/40">M.G. Road Corridor, Suryapet DT</p>
                                </div>
                            </div>

                            <div className="flex gap-6 group cursor-pointer" onClick={() => window.open('tel:+919948076665')}>
                                <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center text-hospital-secondary border border-white/80 group-hover:scale-110 group-hover:-rotate-12 transition-all shadow-clinical group-hover:shadow-premium shrink-0">
                                    <Phone size={28} />
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-hospital-dark tracking-tighter leading-none mb-2">+91 99480 76665</p>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-hospital-primary opacity-60 italic">Emergency Hub</p>
                                </div>
                            </div>

                            <div className="flex gap-6 group cursor-pointer" onClick={() => window.open('tel:+919154404051')}>
                                <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center text-hospital-primary border border-white/80 group-hover:scale-110 group-hover:rotate-12 transition-all shadow-clinical group-hover:shadow-premium shrink-0">
                                    <Plus size={28} />
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-hospital-dark tracking-tighter leading-none mb-2">+91 91544 04051</p>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-hospital-secondary opacity-60 italic">Lab Operations</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Legal and Security */}
                    <div className="space-y-12">
                        <h4 className="text-overline border-l-2 border-hospital-primary pl-6">Security Protocol</h4>
                        <div className="grid grid-cols-1 gap-5">
                            {[
                                { icon: <ShieldCheck size={20} />, label: 'Privacy Registry', to: '/info/privacy-policy' },
                                { icon: <FileText size={20} />, label: 'Terms of Care', to: '/info/terms' },
                                { icon: <HelpCircle size={20} />, label: 'Knowledge Base', to: '/info/faq' },
                                { icon: <Info size={20} />, label: 'Clinical Security', to: '/info/security' }
                            ].map((link, i) => (
                                <Link key={i} to={link.to} className="flex items-center justify-between p-6 bg-white/50 rounded-[2rem] border border-white/80 hover:border-hospital-primary transition-all group shadow-clinical hover:shadow-premium">
                                    <div className="flex items-center gap-5">
                                        <div className="text-hospital-slate/40 group-hover:text-hospital-secondary transition-colors">{link.icon}</div>
                                        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-hospital-slate/60 group-hover:text-hospital-dark transition-colors">{link.label}</span>
                                    </div>
                                    <ArrowUpRight size={18} className="text-hospital-slate/20 group-hover:text-hospital-primary transition-all" />
                                </Link>
                            ))}
                        </div>
                    </div>

                </div>

                <div className="pt-20 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex flex-col items-center md:items-start space-y-3">
                        <p className="text-[10px] font-black text-hospital-slate/40 uppercase tracking-[0.5em]">© 2026 SRI KAMALA INTEGRATED SYSTEMS. GLOBAL REGISTRY</p>
                        <p className="text-[9px] font-bold text-hospital-slate/20 tracking-[1em] uppercase">Engineered for LIFE-CRITICAL Operations // CHAMA-V4</p>
                    </div>
                    <div className="flex items-center gap-10">
                        <div className="flex items-center gap-4 text-hospital-primary">
                            <Heart size={18} fill="currentColor" className="animate-pulse" />
                            <span className="text-overline opacity-100">Preservation Logic Active</span>
                        </div>
                        <div className="w-12 h-12 rounded-full border border-black/5 flex items-center justify-center opacity-30 hover:opacity-100 hover:border-hospital-primary hover:text-hospital-primary transition-all cursor-pointer">
                            <Plus size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Decor Spatials */}
            <div className="absolute top-1/2 right-[-10%] opacity-[0.01] text-hospital-dark pointer-events-none -rotate-12"><Syringe size={280} /></div>
            <div className="absolute bottom-1/4 left-[-10%] opacity-[0.01] text-hospital-secondary pointer-events-none rotate-12"><Droplets size={250} /></div>
        </footer>
    );
};

export default Footer;
