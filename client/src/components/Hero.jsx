import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, Activity, Calendar, Play, Sparkles, Cpu, Fingerprint, Plus, Droplets, Scissors, Pill, Syringe, Orbit, HeartPulse } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-hospital-surface pt-20 pb-20 px-6 sm:px-12 grainy">

            {/* NEW: Advanced Ambient Architecture */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-hospital-primary/5 rounded-full blur-[180px] animate-pulse-soft opacity-40"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-hospital-secondary/5 rounded-full blur-[160px] animate-pulse-soft opacity-30" style={{ animationDelay: '3s' }}></div>

                {/* Mesh Gradient Overlay */}
                <div className="absolute inset-0 mesh-background"></div>
            </div>

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 items-center">

                    {/* Content Section: Detailed Typography & Messaging */}
                    <div className="lg:col-span-7">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            className="inline-flex items-center gap-3 px-6 py-2 bg-white/60 border border-white/80 rounded-full shadow-clinical mb-10 backdrop-blur-md"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-hospital-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-hospital-primary"></span>
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-hospital-slate/80">Clinical Vanguard Node</span>
                        </motion.div>

                        <div className="space-y-8">
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <h1 className="text-6xl md:text-9xl font-black text-hospital-dark leading-[0.85] tracking-tighter mb-6">
                                    <span className="block mb-2 overflow-hidden">
                                        <motion.span
                                            className="block"
                                            initial={{ y: "100%" }}
                                            animate={{ y: 0 }}
                                            transition={{ delay: 0.4, duration: 1 }}
                                        >Precision</motion.span>
                                    </span>
                                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-hospital-primary via-hospital-dark to-hospital-primary bg-[length:200%_auto] animate-gradient-slow italic font-serif">Care.</span>
                                </h1>

                                <p className="font-['Noto_Sans_Telugu'] text-2xl md:text-4xl text-hospital-primary font-bold italic mb-8 max-w-2xl leading-tight">
                                    ఆధునిక వైద్యం - ఆత్మీయ సంరక్షణ
                                </p>
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: 0.8, duration: 1 }}
                                className="text-lg md:text-xl text-hospital-slate/80 max-w-xl leading-relaxed font-sans"
                            >
                                Redefining the boundaries of medical excellence through advanced AI-driven diagnostics and compassionate clinical telemetry.
                            </motion.p>
                        </div>

                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="flex flex-col sm:flex-row items-center gap-6 mt-12"
                        >
                            <Link to="/book" className="btn-clinical group w-full sm:w-auto h-20 px-16 rounded-[2.5rem]">
                                <span className="flex items-center gap-4">
                                    <span className="font-['Noto_Sans_Telugu'] text-2xl">బుకింగ్</span>
                                    <span className="opacity-40 italic">/ BOOK NOW</span>
                                    <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                                </span>
                            </Link>

                            <Link to="/ai-health" className="flex items-center gap-4 p-2 pr-10 glass-panel rounded-[2.5rem] hover:shadow-premium transition-all group">
                                <div className="w-16 h-16 bg-hospital-dark text-white rounded-[1.8rem] flex items-center justify-center group-hover:rotate-12 transition-transform shadow-xl">
                                    <Sparkles size={24} className="text-hospital-secondary" />
                                </div>
                                <div className="text-left">
                                    <span className="font-outfit text-xs font-black uppercase tracking-widest text-hospital-slate block mb-1">AI Diagnostics</span>
                                    <span className="font-['Noto_Sans_Telugu'] text-xl block text-hospital-dark font-black">AI హెల్త్</span>
                                </div>
                            </Link>
                        </motion.div>
                    </div>

                    {/* NEW: Visual Interactive Node */}
                    <div className="lg:col-span-5 relative">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                            className="relative z-10"
                        >
                            <div className="relative aspect-square rounded-[5rem] overflow-hidden shadow-premium group">
                                <img
                                    src="/premium_hospital_hero_1774547670024.png"
                                    alt="Clinical Excellence"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-hospital-dark/40 to-transparent"></div>

                                {/* Floating Badge Component */}
                                <motion.div
                                    animate={{ y: [0, -20, 0] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute bottom-10 -left-10 glass-panel p-8 flex flex-col gap-2 shadow-clinical backdrop-blur-3xl border-white/60"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-hospital-secondary/20 flex items-center justify-center text-hospital-secondary">
                                            <HeartPulse size={20} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-hospital-dark">Live Systems</span>
                                    </div>
                                    <span className="text-4xl font-black text-hospital-dark font-outfit tracking-tighter">99.9%</span>
                                    <span className="text-[8px] font-black text-hospital-slate uppercase tracking-[0.3em]">Precision Accuracy</span>
                                </motion.div>
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-hospital-primary/10 rounded-full blur-3xl animate-pulse"></div>
                            <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-hospital-secondary/10 rounded-full blur-3xl animate-pulse-soft"></div>
                        </motion.div>

                        {/* Background Floating Nodes */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] -z-10 bg-icon-node opacity-[0.05]">
                            <Orbit size={600} strokeWidth={0.5} className="animate-spin-slow" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Global Perspective Decor */}
            <div className="absolute top-1/4 left-[-10%] opacity-[0.02] text-hospital-dark pointer-events-none -rotate-12 animate-float">
                <Plus size={400} />
            </div>
        </section>
    );
};

export default Hero;
