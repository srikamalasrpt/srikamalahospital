import React, { useEffect, useState } from 'react';
import { FlaskRound as Flask, Search, Heart, Plus, Microscope, Orbit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchLabTests } from '../utils/api';
import DiagnosticBookingModal from '../components/DiagnosticBookingModal';

const Diagnosis = () => {
  const [tests, setTests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadTests = async () => {
      try {
        const response = await fetchLabTests();
        setTests(response.data.success ? response.data.tests : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadTests();
  }, []);

  const fallbackTests = [
    { name: 'Complete Blood Picture (CBP)', category: 'Hematology', price: 250, report_time: 12 },
    { name: 'Blood Glucose (Sugar)', category: 'Biochemistry', price: 150, report_time: 6 },
    { name: 'Differential Count (DC)', category: 'Hematology', price: 200, report_time: 12 },
    { name: 'ESR (1st & 2nd Hour)', category: 'Hematology', price: 100, report_time: 12 },
    { name: 'Absolute Eosinophils Count (AEC)', category: 'Hematology', price: 300, report_time: 12 },
    { name: 'Hemoglobin (Hb)', category: 'Hematology', price: 120, report_time: 8 },
    { name: 'Packed Cell Volume (PCV)', category: 'Hematology', price: 140, report_time: 8 },
    { name: 'Total Leukocyte Count (TLC)', category: 'Hematology', price: 170, report_time: 12 },
    { name: 'Platelet Count', category: 'Hematology', price: 180, report_time: 12 },
    { name: 'Reticulocyte Count', category: 'Hematology', price: 260, report_time: 18 },
    { name: 'PT/INR', category: 'Coagulation', price: 320, report_time: 18 },
    { name: 'APTT', category: 'Coagulation', price: 350, report_time: 24 },
    { name: 'Peripheral Smear', category: 'Hematology', price: 350, report_time: 24 },
    { name: 'Thyroid Profile (T3/T4/TSH)', category: 'Hormonal', price: 450, report_time: 24 },
    { name: 'Lipid Profile', category: 'Cardiology', price: 500, report_time: 24 },
    { name: 'Liver Function Test', category: 'Biochemistry', price: 650, report_time: 24 },
    { name: 'Kidney Function Test', category: 'Biochemistry', price: 750, report_time: 24 },
    { name: 'HbA1c', category: 'Diabetes', price: 450, report_time: 24 },
    { name: 'CRP', category: 'Immunology', price: 420, report_time: 24 }
  ];

  const handleBookTest = (test) => {
    setSelectedTest(test);
    setIsModalOpen(true);
  };

  const currentTests = (tests && tests.length > 0) ? tests : fallbackTests;

  const filteredTests = currentTests.filter(test => 
    test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-32 pb-20 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-hospital-primary/5 rounded-bl-[200px] z-0 pointer-events-none"></div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 rounded-[28px] bg-white border border-hospital-primary/10 shadow-sm flex items-center justify-between gap-4"
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-400">3D Live Diagnostic Desk</p>
            <p className="text-sm font-bold text-hospital-dark">Animated workflow for test selection, booking, and receipt generation.</p>
          </div>
          <div className="relative w-16 h-16">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 rounded-full border border-hospital-primary/30" />
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }} className="absolute inset-2 rounded-full border border-hospital-secondary/30" />
            <div className="absolute inset-0 flex items-center justify-center text-hospital-primary"><Orbit size={22} /></div>
          </div>
        </motion.div>
        
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
            <div className="max-w-xl text-center md:text-left">
               <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
                  <div className="w-8 h-8 rounded-xl bg-hospital-primary flex items-center justify-center text-white shadow-lg"><Flask size={18} /></div>
                  <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-hospital-secondary">Advanced Diagnostics</h4>
               </div>
               <h2 className="text-4xl lg:text-5xl font-black text-hospital-dark leading-none font-['Noto_Sans_Telugu']">పరిపూర్ణ <span className="text-hospital-secondary italic">ల్యాబ్</span> <br/>పరీక్షలు.</h2>
               <p className="text-[10px] uppercase font-bold text-gray-300 tracking-[0.3em] mt-3">Precision Laboratory Insights</p>
               <p className="text-xs font-medium text-gray-500 mt-6 font-['Noto_Sans_Telugu'] italic">WHO-ధృవీకరించబడిన డయాగ్నోస్టిక్ సెంటర్ | ఎం.జి రోడ్డు, సూర్యాపేట</p>
            </div>

            <div className="w-full md:w-[350px] relative group">
                <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-hospital-primary/40 group-focus-within:text-hospital-primary transition-all z-10" />
                <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} type="text" placeholder="Search Blood Tests..."
                  className="w-full bg-white border-2 border-transparent focus:border-hospital-primary/20 shadow-xl p-5 pl-14 rounded-[32px] outline-none text-sm font-bold transition-all" />
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[8px] font-black tracking-[0.4em] text-gray-200 uppercase whitespace-nowrap">Clinical Search Engine</div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredTests.map((test, index) => (
            <motion.div key={index} 
              initial={{ y: 30, opacity: 0 }} 
              whileInView={{ y: 0, opacity: 1 }} 
              transition={{ delay: index * 0.05 }}
              whileHover={{ 
                scale: 1.05, 
                rotateX: 2, 
                rotateY: -2,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
              }}
              style={{ perspective: "1000px" }}
              className="bg-white p-8 rounded-[48px] border-2 border-transparent hover:border-hospital-primary/10 shadow-sm transition-all group relative overflow-hidden h-full flex flex-col cursor-pointer"
              onClick={() => handleBookTest(test)}
            >
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="w-8 h-8 rounded-full bg-hospital-mint flex items-center justify-center text-hospital-primary"><Plus size={16}/></div>
              </div>

              <div className="mb-8">
                 <div className="w-16 h-16 bg-hospital-primary rounded-3xl flex items-center justify-center text-white shadow-xl mb-6 group-hover:rotate-12 transition-transform">
                    <Microscope size={32} />
                 </div>
                 <div className="px-3 py-1 bg-gray-50 rounded-full border border-gray-100 text-[8px] font-black uppercase tracking-widest text-gray-400 inline-block mb-3">
                    {test.category}
                 </div>
                 <h3 className="text-xl font-black text-hospital-dark leading-tight line-clamp-2 h-[3.5rem]">{test.name}</h3>
              </div>

              <div className="mt-auto space-y-6">
                 <div className="flex justify-between items-end border-b border-gray-50 pb-4">
                    <div>
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1 leading-none">Price Est.</p>
                        <p className="text-3xl font-black text-hospital-dark tracking-tighter">₹{test.price}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1 leading-none">Report</p>
                        <p className="text-sm font-black text-hospital-secondary">{test.report_time}H</p>
                    </div>
                 </div>
                 
                 <button className="w-full bg-hospital-dark text-white py-4 rounded-[24px] text-[10px] font-black uppercase tracking-widest shadow-lg group-hover:bg-hospital-primary group-hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 border-none">
                    <Heart size={14} className="group-hover:fill-white transition-all" /> Book Now
                 </button>
              </div>
              
              <div className="absolute -bottom-1 left-0 w-full h-1 bg-hospital-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </motion.div>
          ))}
        </div>

        {filteredTests.length === 0 && (
           <div className="bg-white p-20 rounded-[60px] shadow-sm border border-dashed border-gray-200 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                 <Search size={40} />
              </div>
              <h3 className="text-2xl font-black text-hospital-dark">No tests found matching "{searchQuery}"</h3>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Try searching with a different keyword like 'Blood' or 'Sugar'</p>
           </div>
        )}

        <div className="mt-20 p-12 bg-hospital-dark rounded-[60px] text-white flex flex-col md:flex-row items-center justify-between shadow-4xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-12 text-white/5 pointer-events-none opacity-50"><Flask size={200}/></div>
           <div className="relative z-10 text-center md:text-left mb-8 md:mb-0">
              <h3 className="text-2xl font-black mb-4 font-['Noto_Sans_Telugu']">నేరుగా కాల్ చేయండి</h3>
              <p className="text-hospital-primary font-black uppercase tracking-widest text-xs mb-2">Instant Lab Consultation line</p>
              <h4 className="text-4xl font-black font-mono">98668 95634</h4>
              <p className="text-[10px] mt-3 uppercase tracking-widest text-gray-300">Hospital Main: 99480 76665 | Open 24 Hours</p>
           </div>
           <div className="relative z-10 flex gap-4">
              <a href="tel:9866895634" className="bg-white text-hospital-dark px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-110 active:scale-95 transition-all outline-none">CALL CLINIC</a>
           </div>
        </div>

      </div>

      <DiagnosticBookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        test={selectedTest} 
      />
    </div>
  );
};

export default Diagnosis;
