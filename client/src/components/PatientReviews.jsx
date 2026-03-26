import React from 'react';
import { Star, Quote, MessageSquare, Heart, ShieldCheck, Award, TrendingUp, Sparkles, Orbit, ChevronRight, Plus, Droplets, Scissors, Syringe } from 'lucide-react';
import { motion } from 'framer-motion';

const PatientReviews = () => {
   const reviews = [
      { name: 'Sunitha Nicky', role: 'Patient Response', text: "Nice hospital and very good response and good staff nurses", rating: 5 },
      { name: 'Ganesh Bommagani', role: 'Diabetes Treatment', text: "Nice hospital best best treatment to diabetes", rating: 5 },
      { name: 'Chamakuri Lokesh', role: 'General Consultation', text: "Good equipment and good consultation", rating: 5 },
      { name: 'Sravanthi G', role: 'Emergency Care', text: "Very talented Doctor.. Available even in midnight in case of emergency..thanqu very much for your service in hard times", rating: 5 },
      { name: 'Mahesh Kumar', role: 'General Medicine', text: "Great care and affordable treatment. Dr. Kiran is very patient and explains everything clearly.", rating: 5 },
      { name: 'Vinay Reddy', role: 'Laboratory Services', text: "Laboratory reports are very accurate and fast. Staff are helpful.", rating: 5 },
      { name: 'Priya Reddy', role: 'Pediatric Care', text: "Highly recommended for families. The hospitality is great and management is quick.", rating: 5 },
      { name: 'Anil Kumar', role: 'Diagnostics', text: "Sri Kamala Hospitals is best for all types of blood tests and scans in Suryapet.", rating: 5 }
   ];

   return (
      <section className="py-32 px-6 bg-hospital-surface relative overflow-hidden grainy">

         <div className="container mx-auto max-w-7xl relative z-10">

            <div className="flex flex-col lg:flex-row gap-16 items-end mb-24 justify-between">
               <div className="max-w-2xl text-left">
                  <div className="flex items-center gap-6 mb-10">
                     <div className="w-16 h-16 rounded-[2rem] bg-white border border-white/80 flex items-center justify-center text-hospital-secondary shadow-premium"><Orbit size={32} className="animate-spin-slow opacity-40" /></div>
                     <div className="space-y-1">
                        <h4 className="text-overline">Global Clinical Feedback // v4.0</h4>
                        <p className="text-[10px] font-bold text-hospital-slate/40 uppercase tracking-[0.2em] italic">Verified Registry Platform</p>
                     </div>
                  </div>
                  <h2 className="heading-clinical text-left">
                     Patient <span className="text-hospital-secondary italic">Insights</span>
                  </h2>
                  <p className="font-['Noto_Sans_Telugu'] text-2xl text-hospital-slate mt-4 font-bold">రోగుల అమూల్యమైన అభిప్రాయాలు</p>
               </div>

               <div className="flex items-center gap-12 glass-panel p-10 rounded-[3rem] border-white/80 mb-6 lg:mb-0 shadow-premium">
                  <div className="text-center group">
                     <p className="text-5xl font-black text-hospital-dark leading-none tracking-tighter tabular-nums group-hover:text-hospital-secondary transition-colors">5.0</p>
                     <p className="text-[9px] font-black uppercase tracking-[0.4em] text-hospital-primary mt-4 opacity-70">AVG INDEX</p>
                  </div>
                  <div className="w-px h-16 bg-hospital-slate/10"></div>
                  <div className="text-center group">
                     <p className="text-5xl font-black text-hospital-dark leading-none tracking-tighter tabular-nums group-hover:text-hospital-primary transition-colors italic">1.2k+</p>
                     <p className="text-[9px] font-black uppercase tracking-[0.4em] text-hospital-slate mt-4 opacity-70">VERIFIED LOGS</p>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
               {reviews.map((rev, i) => (
                  <motion.div key={i}
                     initial={{ opacity: 0, scale: 0.95 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                     className="premium-card group p-12 flex flex-col items-start relative overflow-hidden h-[480px] border-white/80"
                  >

                     {/* Decorative Quote */}
                     <div className="absolute top-0 right-0 p-8 text-hospital-primary opacity-[0.03] group-hover:rotate-12 group-hover:scale-125 transition-all duration-1000 pointer-events-none">
                        <Quote size={180} fill="currentColor" />
                     </div>

                     <div className="w-20 h-20 bg-hospital-surface rounded-[2rem] flex items-center justify-center text-hospital-secondary mb-10 border border-white/60 shadow-clinical relative group-hover:scale-110 transition-transform duration-700">
                        <Quote className="text-hospital-secondary clinical-glow z-10" size={28} fill="currentColor" />
                     </div>

                     <div className="flex gap-2 mb-8">
                        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} className="text-hospital-primary clinical-glow" fill="currentColor" />)}
                     </div>

                     <p className="text-base font-medium italic text-hospital-slate/80 mb-10 leading-relaxed line-clamp-4 h-28 overflow-hidden group-hover:text-hospital-dark transition-colors font-serif">
                        "{rev.text}"
                     </p>

                     <div className="mt-auto pt-8 border-t border-black/5 w-full">
                        <h5 className="font-black text-hospital-dark text-xl tracking-tight mb-2 group-hover:text-hospital-primary transition-colors font-['Noto_Sans_Telugu']">
                           {rev.name}
                        </h5>
                        <div className="flex items-center gap-3">
                           <div className="w-1.5 h-1.5 rounded-full bg-hospital-secondary"></div>
                           <p className="text-[9px] uppercase font-black tracking-[0.4em] text-hospital-primary opacity-60 italic">{rev.role}</p>
                        </div>
                     </div>

                     <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-hospital-secondary animate-pulse"></div>
                        <span className="text-[8px] font-black uppercase text-hospital-slate/40 tracking-[0.3em]">Verified Unit</span>
                     </div>

                  </motion.div>
               ))}
            </div>

            <div className="mt-32 flex justify-center">
               <a href="https://g.page/srikamala/review" className="btn-clinical h-20 px-16 group rounded-[2.5rem]">
                  <span className="flex items-center gap-5">
                     <MessageSquare size={20} />
                     ADD TO REGISTRY // అభిప్రాయం
                     <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
                  </span>
               </a>
            </div>

         </div>

         {/* Local Background Decor */}
         <div className="absolute top-1/4 left-[-10%] opacity-[0.01] text-hospital-dark pointer-events-none -rotate-12"><Heart size={350} /></div>
         <div className="absolute bottom-[10%] right-[-10%] opacity-[0.01] text-hospital-primary pointer-events-none rotate-12"><Plus size={400} /></div>

      </section>
   );
};

export default PatientReviews;
