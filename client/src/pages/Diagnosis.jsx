import React, { useState, useEffect } from 'react';
import { Search, FlaskConical, Clock, CreditCard, ChevronRight, Activity, FlaskRound as Flask, ShieldCheck, Microscope, Thermometer } from 'lucide-react';
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
    { name: 'Blood Glucose', category: 'Biochemistry', price: 150, report_time: 12 },
    { name: 'Lipid Profile', category: 'Cardiology', price: 450, report_time: 24 },
    { name: 'Thyroid (T3/T4/TSH)', category: 'Hormonal', price: 350, report_time: 24 },
    { name: 'CBC (Complete Blood Count)', category: 'Hematology', price: 200, report_time: 12 }
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
        
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
            <div className="max-w-xl text-center md:text-left">
               <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
                  <div className="w-8 h-8 rounded-xl bg-hospital-primary flex items-center justify-center text-white shadow-lg"><Flask size={18} /></div>
                  <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-hospital-secondary">Advanced Diagnostics</h4>
               </div>
               <h2 className="text-4xl lg:text-5xl font-black text-hospital-dark leading-none font-['Noto_Sans_Telugu']">పరిపూర్ణ <span className="text-hospital-secondary italic">ల్యాబ్</span> <br/>పరీక్షలు.</h2>
               <p className="text-[10px] uppercase font-bold text-gray-300 tracking-[0.3em] mt-3">Precision Laboratory Insights</p>
               <p className="text-xs font-medium text-gray-500 mt-6 font-['Noto_Sans_Telugu'] italic">WHO-ధృవీకరించబడిన డయాగ్నోస్టిక్ సెంటర్.</p>
            </div>

            <div className="w-full md:w-[350px] relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <input type="text" placeholder="పరీక్ష కోసం వెతకండి (e.g. Sugar)" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-gray-100 p-4 pl-12 rounded-[28px] shadow-lg outline-none text-sm font-black transition-all placeholder:text-gray-200" />
            </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
           {[
             { te: 'ధృవీకరించబడిన ల్యాబ్స్', en: 'Certified Labs', icon: <Microscope size={14}/> },
             { te: 'సురక్షితమైన డేటా', en: 'Encrypted Data', icon: <ShieldCheck size={14}/> },
             { te: '24 గంటల్లో రిపోర్ట్', en: '24HR Turnaround', icon: <Clock size={14}/> },
             { te: 'ఆన్‌లైన్ రిపోర్ట్స్', en: 'Free Reports', icon: <Thermometer size={14}/> }
           ].map((stat, i) => (
              <div key={i} className="p-5 rounded-[28px] bg-white border border-gray-50 flex items-center gap-3 shadow-md hover:shadow-xl transition-all">
                 <div className="w-8 h-8 bg-hospital-mint rounded-xl flex items-center justify-center text-hospital-primary shadow-sm shrink-0">{stat.icon}</div>
                 <div className="leading-tight">
                    <p className="text-[10px] font-black font-['Noto_Sans_Telugu'] text-hospital-dark">{stat.te}</p>
                    <p className="text-[7px] font-black uppercase tracking-widest text-gray-300 mt-0.5">{stat.en}</p>
                 </div>
              </div>
           ))}
        </div>

        <AnimatePresence mode="wait">
            {loading ? (
               <div className="flex flex-col items-center justify-center py-40">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-8 h-8 border-4 border-hospital-primary/20 border-t-hospital-primary rounded-full mb-4"></motion.div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Synchronizing Parameters...</p>
               </div>
            ) : (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} 
                   className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {filteredTests.map((test, index) => (
                      <motion.div key={index} whileHover={{ y: -4 }} 
                           className="bg-white p-8 flex flex-col items-center text-center group relative overflow-hidden border border-gray-100 rounded-[40px] shadow-lg hover:shadow-2xl transition-all duration-500">
                         
                         <div className="w-14 h-14 bg-hospital-mint flex items-center justify-center rounded-[20px] mb-6 text-hospital-primary group-hover:scale-110 transition-transform">
                            <Activity size={20} />
                         </div>

                         <div className="mb-6">
                            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-hospital-primary mb-1">{test.category}</p>
                            <h3 className="text-xl font-black text-hospital-dark mb-1 leading-none font-['Noto_Sans_Telugu']">{test.name}</h3>
                            <p className="text-[10px] font-medium text-gray-400 opacity-60 italic">Advanced Diagnostic Profiling</p>
                         </div>

                         <div className="w-full flex items-center justify-between mb-8 pt-6 border-t border-gray-50">
                             <div className="text-left">
                                <p className="text-[8px] font-black uppercase text-gray-300 tracking-widest mb-1 leading-none">ఖర్చు (Cost)</p>
                                <p className="text-xl font-black text-hospital-dark tabular-nums">₹{test.price}</p>
                             </div>
                             <div className="text-right">
                                <p className="text-[8px] font-black uppercase text-gray-300 tracking-widest mb-1 leading-none">సమయం (Time)</p>
                                <p className="text-xs font-black text-hospital-primary">{test.report_time}H</p>
                             </div>
                         </div>

                         <button onClick={() => handleBookTest(test)} className="w-full premium-button bg-hospital-dark text-white justify-center py-3.5 shadow-xl border-none">
                            <span className="relative z-10 font-['Noto_Sans_Telugu'] text-base mr-3 font-bold tracking-tight">పరీక్ష బుక్ చేయండి</span>
                            <span className="text-[8px] tracking-widest opacity-30 mt-1 uppercase">/ Book</span>
                         </button>
                      </motion.div>
                   ))}
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isModalOpen && selectedTest && (
          <DiagnosticBookingModal 
            test={selectedTest} 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Diagnosis;
