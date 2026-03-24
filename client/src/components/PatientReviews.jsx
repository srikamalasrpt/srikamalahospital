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
    <section className="py-32 px-6 bg-black relative overflow-hidden">
      
      {/* Background Decor Spire */}
      <div className="absolute top-0 right-1/2 -translate-x-1/2 w-px h-40 bg-gradient-to-b from-white/10 to-transparent"></div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
        
        <div className="flex flex-col lg:flex-row gap-12 items-end mb-24 justify-between">
            <div className="max-w-2xl">
               <div className="flex items-center gap-5 mb-10">
                  <div className="w-16 h-16 rounded-[28px] bg-white/5 border border-white/10 flex items-center justify-center text-hospital-secondary shadow-4xl shadow-hospital-secondary/10"><Orbit size={28} className="animate-spin-slow" /></div>
                  <h4 className="text-[11px] font-black uppercase tracking-[0.6em] text-hospital-primary leading-none">Global Clinical Feedback Registry</h4>
               </div>
               <h2 className="text-4xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter font-['Noto_Sans_Telugu'] mb-6 transition-all hover:scale-[1.01] origin-left">రోగుల <span className="text-hospital-secondary italic font-serif">అభిప్రాయాలు</span>.</h2>
               <p className="text-[11px] uppercase font-bold text-gray-500 tracking-[0.8em] mt-2 leading-none italic">Verified Clinical Performance Metrics v3.0</p>
            </div>
            
            <div className="flex items-center gap-10 bg-white/5 p-12 rounded-[60px] border border-white/10 shadow-4xl backdrop-blur-3xl">
                <div className="text-center group">
                   <p className="text-5xl font-black text-white leading-none tracking-tighter tabular-nums group-hover:text-hospital-secondary transition-colors">5.0</p>
                   <p className="text-[9px] font-black uppercase tracking-[0.4em] text-hospital-primary mt-4 opacity-70">AVG. INDEX</p>
                </div>
                <div className="w-px h-16 bg-white/10"></div>
                <div className="text-center group">
                   <p className="text-5xl font-black text-white leading-none tracking-tighter tabular-nums group-hover:text-hospital-primary transition-colors italic">21</p>
                   <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-500 mt-4 opacity-70">VERIFIED LOGS</p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {reviews.map((rev, i) => (
            <motion.div key={i} 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 1 }}
                whileHover={{ y: -15 }} 
                className="group bg-white/5 p-14 rounded-[60px] border border-white/5 shadow-4xl transition-all duration-1000 flex flex-col items-center text-center relative overflow-hidden h-[500px] hover:border-white/20 active:scale-95">
                
                {/* Decorative High-Contrast Elements */}
                <div className="absolute top-0 right-0 p-10 text-white opacity-[0.03] group-hover:rotate-12 group-hover:scale-125 transition-transform duration-1000 pointer-events-none"><Quote size={150} fill="currentColor" /></div>
                
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-hospital-secondary mb-12 border border-white/10 shadow-4xl relative group-hover:scale-110 transition-transform duration-700 backdrop-blur-3xl overflow-hidden">
                    <div className="absolute inset-0 bg-hospital-secondary/5 rounded-full animate-pulse-soft"></div>
                    <Quote className="text-hospital-secondary relative z-10" size={32} fill="currentColor" />
                </div>

                <div className="flex gap-2 mb-8">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} className="text-hospital-primary group-hover:scale-125 transition-transform" fill="currentColor" style={{ transitionDelay: `${s * 50}ms` }} />)}
                </div>

                <p className="text-[15px] font-medium italic text-gray-400 mb-12 leading-relaxed line-clamp-4 h-28 overflow-hidden group-hover:text-white transition-colors font-serif">"{rev.text}"</p>
                
                <div className="mt-auto pt-8 border-t border-white/5 w-full flex flex-col items-center">
                    <h5 className="font-black text-white text-xl tracking-tight mb-2 group-hover:text-hospital-primary transition-colors font-['Noto_Sans_Telugu']">{rev.name}</h5>
                    <p className="text-[10px] uppercase font-black tracking-[0.4em] text-hospital-primary opacity-60 italic">{rev.role}</p>
                </div>
                
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-neon-secondary"></div>
                   <span className="text-[9px] font-black uppercase text-gray-400 tracking-[0.3em]">Verified Registry Unit</span>
                </div>

            </motion.div>
          ))}
        </div>
        
        {/* Footer Interaction Command */}
        <div className="mt-32 flex justify-center opacity-40 hover:opacity-100 transition-opacity group">
           <a href="https://g.page/srikamala/review" className="flex items-center gap-5 py-6 px-14 bg-white/5 rounded-[35px] border border-white/10 text-[11px] font-black uppercase tracking-[0.6em] text-gray-500 group-hover:bg-hospital-primary group-hover:text-black group-hover:border-transparent group-hover:shadow-4xl transition-all backdrop-blur-3xl">
              <MessageSquare size={20} /> Contribute to Global Registry <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
           </a>
        </div>

      </div>

      {/* Local Background Decor */}
      <div className="absolute top-1/4 left-[5%] opacity-[0.03] text-white"><Scissors size={140} /></div>
      <div className="absolute bottom-1/4 right-[5%] opacity-[0.03] text-hospital-secondary"><Droplets size={120} /></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 opacity-[0.01] text-white"><Plus size={300} /></div>

    </section>
  );
};

export default PatientReviews;
