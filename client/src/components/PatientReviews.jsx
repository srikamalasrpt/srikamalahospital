import React from 'react';
import { Star, Quote, MessageSquare, Heart, ShieldCheck, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const PatientReviews = () => {
  const reviews = [
    { name: 'Sunitha Nicky', role: 'Patient Response', text: "Nice hospital and very good response and good staff nurses", rating: 5 },
    { name: 'Ganesh Bommagani', role: 'Diabetes Treatment', text: "Nice hospital best best treatment to diabetes", rating: 5 },
    { name: 'Chamakuri Lokesh', role: 'General Consultation', text: "Good equipment and good consultation", rating: 5 },
    { name: 'Anonymous', role: 'Emergency Care', text: "Very talented Doctor.. Available even in midnight in case of emergency..thanqu very much for your service in hard times", rating: 5 }
  ];

  return (
    <section className="py-20 px-6 bg-white relative overflow-hidden">
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-end mb-16 justify-between">
           <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-8 h-8 rounded-xl bg-hospital-secondary flex items-center justify-center text-white shadow-lg"><Star size={16} fill="currentColor" /></div>
                 <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-hospital-primary">Google Reviews</h4>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-hospital-dark leading-none font-['Noto_Sans_Telugu']">రోగుల <span className="text-hospital-secondary italic font-serif">అభిప్రాయాలు</span>.</h2>
              <p className="text-[10px] uppercase font-bold text-gray-300 tracking-[0.3em] mt-3 leading-none">Real Patient Testimonials</p>
           </div>
           
           <div className="flex items-center gap-6 bg-gray-50 p-6 rounded-[32px] border border-gray-100">
               <div className="text-center">
                  <p className="text-2xl font-black text-hospital-dark leading-none tracking-tighter tabular-nums">5.0</p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-hospital-primary mt-2">AVG. RATING</p>
               </div>
               <div className="w-px h-8 bg-gray-200"></div>
               <div className="text-center">
                  <p className="text-2xl font-black text-hospital-dark leading-none tracking-tighter tabular-nums">21</p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mt-2">TOTAL REVIEWS</p>
               </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev, i) => (
            <motion.div key={i} whileHover={{ y: -5 }} 
                className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-md hover:shadow-xl transition-all flex flex-col items-center text-center">
                
                <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center text-hospital-secondary mb-6 border-2 border-white shadow-inner relative">
                    <Quote className="text-hospital-secondary/20" size={16} fill="currentColor" />
                </div>

                <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} className="text-hospital-primary" fill="currentColor" />)}
                </div>

                <p className="text-xs font-medium italic text-gray-400 mb-8 leading-relaxed line-clamp-4 h-16 underline decoration-gray-100 underline-offset-4 decoration-dashed">"{rev.text}"</p>
                
                <div className="mt-auto pt-4 border-t border-gray-50 w-full">
                    <h5 className="font-black text-hospital-dark text-sm tracking-tight mb-0.5">{rev.name}</h5>
                    <p className="text-[8px] uppercase font-black tracking-widest text-hospital-primary opacity-40">{rev.role}</p>
                </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PatientReviews;
