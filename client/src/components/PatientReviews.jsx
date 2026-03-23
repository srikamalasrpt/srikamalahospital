import React from 'react';
import { Star, Quote, MessageSquare, Heart, ShieldCheck, Award, TrendingUp, Sparkles, Orbit } from 'lucide-react';
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
    <section className="py-32 px-6 bg-white relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-1/2 -translate-x-1/2 w-px h-40 bg-gradient-to-b from-gray-100 to-transparent"></div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
        
        <div className="flex flex-col lg:flex-row gap-12 items-end mb-24 justify-between">
            <div className="max-w-2xl">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-hospital-secondary/10 flex items-center justify-center text-hospital-secondary shadow-xl shadow-hospital-secondary/5"><Orbit size={24} className="animate-spin-slow" /></div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-hospital-primary leading-none">Global Clinical Feedback</h4>
               </div>
               <h2 className="text-4xl lg:text-7xl font-black text-hospital-dark leading-none tracking-tighter font-['Noto_Sans_Telugu'] mb-4 transition-all hover:scale-[1.01] origin-left">రోగుల <span className="text-hospital-secondary italic font-['Playfair_Display']">అభిప్రాయాలు</span>.</h2>
               <p className="text-[10px] uppercase font-bold text-gray-300 tracking-[0.6em] mt-3 leading-none italic">Verified Patient Protocol Metrics</p>
            </div>
            
            <div className="flex items-center gap-10 bg-gray-50/50 p-10 rounded-[50px] border border-gray-100 shadow-2xl shadow-hospital-dark/5 backdrop-blur-sm">
                <div className="text-center group">
                   <p className="text-4xl font-black text-hospital-dark leading-none tracking-tighter tabular-nums group-hover:text-hospital-primary transition-colors">5.0</p>
                   <p className="text-[8px] font-black uppercase tracking-[0.3em] text-hospital-primary mt-3 opacity-60">AVG. INDEX</p>
                </div>
                <div className="w-px h-12 bg-gray-200"></div>
                <div className="text-center group">
                   <p className="text-4xl font-black text-hospital-dark leading-none tracking-tighter tabular-nums group-hover:text-hospital-secondary transition-colors italic">21</p>
                   <p className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400 mt-3 opacity-60">VERIFIED LOGS</p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {reviews.map((rev, i) => (
            <motion.div key={i} 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                whileHover={{ y: -10 }} 
                className="group bg-white p-12 rounded-[50px] border border-gray-50 shadow-2xl shadow-hospital-dark/5 transition-all duration-700 flex flex-col items-center text-center relative overflow-hidden h-[450px]">
                
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 p-8 text-hospital-primary/5 group-hover:rotate-12 group-hover:scale-125 transition-transform duration-700 pointer-events-none"><Quote size={100} fill="currentColor" /></div>
                
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-hospital-secondary mb-10 border-[6px] border-white shadow-xl relative group-hover:scale-110 transition-transform duration-700">
                    <div className="absolute inset-0 bg-hospital-secondary/5 rounded-full animate-pulse-soft"></div>
                    <Quote className="text-hospital-secondary relative z-10" size={24} fill="currentColor" />
                </div>

                <div className="flex gap-1.5 mb-6">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} className="text-hospital-primary group-hover:scale-125 transition-transform" fill="currentColor" style={{ transitionDelay: `${s * 50}ms` }} />)}
                </div>

                <p className="text-sm font-medium italic text-gray-500 mb-10 leading-relaxed line-clamp-4 h-24 overflow-hidden group-hover:text-hospital-dark transition-colors font-serif">"{rev.text}"</p>
                
                <div className="mt-auto pt-6 border-t border-gray-50 w-full flex flex-col items-center">
                    <h5 className="font-black text-hospital-dark text-lg tracking-tight mb-1 group-hover:text-hospital-primary transition-colors font-['Noto_Sans_Telugu']">{rev.name}</h5>
                    <p className="text-[9px] uppercase font-black tracking-[0.3em] text-hospital-primary opacity-40 italic">{rev.role}</p>
                </div>
                
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-neon-secondary"></div>
                   <span className="text-[8px] font-black uppercase text-gray-300 tracking-[0.2em]">Verified Registry Unit</span>
                </div>

            </motion.div>
          ))}
        </div>
        
        {/* Footer Prompt */}
        <div className="mt-24 flex justify-center opacity-40 hover:opacity-100 transition-opacity group">
           <a href="https://g.page/srikamala/review" className="flex items-center gap-4 py-4 px-10 bg-gray-50 rounded-[28px] border border-gray-100 text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 group-hover:bg-hospital-primary group-hover:text-white group-hover:border-transparent group-hover:shadow-2xl transition-all">
              <MessageSquare size={16} /> Contribute to Global Registry <ChevronRight size={14} />
           </a>
        </div>

      </div>
    </section>
  );
};

export default PatientReviews;
