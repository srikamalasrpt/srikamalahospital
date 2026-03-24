import React, { useMemo } from 'react';
import { Activity, ShieldCheck, Heart, Users, Zap, Search, ChevronRight, Droplets, Plus, Scissors, Syringe, Pill } from 'lucide-react';
import { motion } from 'framer-motion';

const ClinicalPulseDashboard = () => {
  const metrics = [
    { label: 'Active Clinical Threads', value: '14', unit: 'NODE', icon: <Zap size={18} />, color: 'text-hospital-primary' },
    { label: 'Verified Physicians', value: '12', unit: 'ELITE', icon: <Users size={18} />, color: 'text-hospital-secondary' },
    { label: 'System Integrity', value: '99.9', unit: '%', icon: <ShieldCheck size={18} />, color: 'text-emerald-400' },
    { label: 'Patient Life Preservations', value: '4500', unit: '+', icon: <Heart size={18} />, color: 'text-rose-400' }
  ];

  return (
    <section className="py-14 px-6 md:px-12 relative z-20 -mt-10 mb-20">
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="bg-white border border-black/5 shadow-4xl !rounded-[50px] p-8 md:p-14 relative overflow-hidden group"
        >
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-14 gap-8">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-hospital-primary border border-black/5 shadow-inner animate-pulse-soft"><Activity size={24} /></div>
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest leading-none mb-1">Clinical Intel Core v3.0</h3>
                <p className="text-[9px] font-black tracking-[0.4em] text-slate-400 uppercase">Real-Time Infrastructure Sync Active</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="px-5 py-2.5 bg-slate-50 border border-black/5 rounded-full text-[9px] font-black uppercase tracking-widest text-hospital-primary flex items-center gap-2 shadow-sm">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></div>
                Suryapet Main: Active
              </div>
              <div className="px-5 py-2.5 bg-slate-50 border border-black/5 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400 shadow-sm">
                Uptime: 24/7/365
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {metrics.map((m, i) => (
              <div key={i} className="relative group">
                <div className="flex items-center gap-5 mb-4 group-hover:translate-x-2 transition-transform duration-700">
                  <div className={`p-4 bg-slate-50 rounded-2xl ${m.color} border border-black/5 shadow-inner`}>{m.icon}</div>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 group-hover:text-slate-900 transition-colors uppercase">{m.label}</span>
                </div>
                <div className="flex items-end gap-2 group-hover:scale-110 group-hover:translate-x-4 transition-all duration-700 origin-left">
                  <span className="text-5xl font-black text-slate-900 tracking-tighter tabular-nums">{m.value}</span>
                  <span className={`text-[11px] font-black uppercase tracking-widest mb-2 ${m.color}`}>{m.unit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Background Ambient Decor Items */}
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none group-hover:rotate-12 group-hover:scale-125 transition-transform duration-1000 text-slate-900"><Plus size={150} strokeWidth={1}/></div>
          <div className="absolute bottom-[-20px] left-[-20px] opacity-[0.03] pointer-events-none text-hospital-secondary"><Droplets size={120} strokeWidth={1} /></div>
          
        </motion.div>
      </div>
    </section>
  );
};

export default ClinicalPulseDashboard;
