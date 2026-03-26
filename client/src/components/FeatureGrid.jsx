import React from 'react';
import { Stethoscope, FlaskConical, ShoppingBag, ListChecks, Search, Ambulance, ChevronRight, Activity, Plus, Sparkles, Brain, Heart, Microscope, Droplets, Scissors, Syringe, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const FeatureGrid = () => {
    const items = [
        {
            title: 'Clinical Diagnostics',
            telugu: 'జనరల్ కన్సల్టేషన్',
            description: 'Elite panel GP access with real-time biometric synchronization and triage.',
            icon: <Stethoscope size={30} />,
            link: '/book',
            color: 'text-emerald-500',
            bg: 'from-emerald-400/20 to-emerald-600/5'
        },
        {
            title: 'AI Neural Core',
            telugu: 'AI రోగ నిర్ధారణ',
            description: 'Predictive health modeling and autonomous patient triage algorithms.',
            icon: <Brain size={30} />,
            link: '/ai-health',
            color: 'text-indigo-500',
            bg: 'from-indigo-400/20 to-indigo-600/5'
        },
        {
            title: 'Pathology Center',
            telugu: 'పాథాలజీ ల్యాబ్',
            description: 'Molecular precision laboratory with automated digital report delivery.',
            icon: <Microscope size={30} />,
            link: '/diagnosis',
            color: 'text-rose-500',
            bg: 'from-rose-400/20 to-rose-600/5'
        },
        {
            title: 'Smart Apothecary',
            telugu: 'అంతర్గత ఫార్మసీ',
            description: 'Verified clinical medication hub with real-time inventory tracking.',
            icon: <ShoppingBag size={30} />,
            link: '/medical-shop',
            color: 'text-blue-500',
            bg: 'from-blue-400/20 to-blue-600/5'
        },
        {
            title: 'Cardiac Analytics',
            telugu: 'గుండె ఆరోగ్యం',
            description: 'Continuous cardiovascular risk assessment and monitoring suite.',
            icon: <Heart size={30} />,
            link: '/ai-health',
            color: 'text-red-500',
            bg: 'from-red-400/20 to-red-600/5'
        },
        {
            title: 'Trauma Response',
            telugu: 'అత్యవసర విభాగం',
            description: 'Level-1 critical care infrastructure available 24/7/365.',
            icon: <Sparkles size={30} />,
            link: '/doctors',
            color: 'text-amber-500',
            bg: 'from-amber-400/20 to-amber-600/5'
        },
    ];

    return (
        <section id="services" className="py-32 px-6 md:px-12 bg-white relative overflow-hidden grainy">

            <div className="container mx-auto max-w-7xl relative z-10">

                <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-12">
                    <div className="max-w-2xl text-left">
                        <div className="flex items-center gap-6 mb-10">
                            <div className="w-16 h-16 rounded-[2rem] bg-hospital-dark text-white flex items-center justify-center shadow-premium"><Activity size={32} /></div>
                            <div className="space-y-1">
                                <h4 className="text-overline">Advanced Ecosystem // v4.0</h4>
                                <p className="text-[10px] font-bold text-hospital-slate/40 uppercase tracking-[0.2em] italic">World-Class Global Healthcare Infrastructure</p>
                            </div>
                        </div>
                        <h2 className="heading-clinical text-left">
                            Elite Clinical <span className="text-hospital-secondary italic">Capabilities</span>
                        </h2>
                        <p className="font-['Noto_Sans_Telugu'] text-2xl text-hospital-slate mt-4 font-bold">మా నిపుణులైన సేవలు మీ ఆరోగ్యం కోసం</p>
                    </div>
                    <button className="btn-clinical h-20 px-12 group rounded-[2rem]">
                        <span className="flex items-center gap-4">VIEW FULL SPECTRUM <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" /></span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {items.map((item, i) => (
                        <motion.div key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="premium-card group p-10 flex flex-col items-start cursor-default border-white/80"
                        >
                            <div className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center mb-10 bg-gradient-to-br ${item.bg} ${item.color} shadow-clinical transition-all duration-700 group-hover:rotate-[15deg] group-hover:shadow-premium`}>
                                <div className="clinical-glow">{item.icon}</div>
                            </div>

                            <div className="flex-1 space-y-5">
                                <h3 className="text-3xl font-black text-hospital-dark tracking-tighter font-['Noto_Sans_Telugu'] group-hover:text-hospital-primary transition-colors leading-tight">
                                    {item.telugu}
                                </h3>
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-hospital-primary"></div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-hospital-slate/50 italic">
                                        {item.title}
                                    </p>
                                </div>
                                <p className="text-base font-medium text-hospital-slate leading-relaxed">
                                    {item.description}
                                </p>
                            </div>

                            <div className="mt-10 w-full pt-8 border-t border-black/5 flex justify-between items-center px-2">
                                <Link to={item.link} className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] text-hospital-dark group-hover:text-hospital-primary transition-all group-hover:gap-6 underline-offset-[10px] hover:underline">
                                    ACTIVATE MODULE <ChevronRight size={16} />
                                </Link>
                                <Plus size={20} className="text-hospital-slate/20 group-hover:text-hospital-secondary group-hover:rotate-90 transition-all duration-500" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Local Clinical Decor */}
            <div className="absolute top-1/2 right-[-10%] opacity-[0.01] text-hospital-dark pointer-events-none -rotate-12"><ShieldCheck size={280} /></div>
            <div className="absolute bottom-0 left-[-10%] opacity-[0.01] text-hospital-primary pointer-events-none rotate-12"><Syringe size={250} /></div>
        </section>
    );
};

export default FeatureGrid;
