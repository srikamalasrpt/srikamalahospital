import React, { useEffect, useState } from 'react';
import { FlaskRound as Flask, Search, Heart, Plus, Microscope, Orbit, ArrowRight, Sparkles, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchLabTests } from '../utils/api';
import DiagnosticBookingModal from '../components/DiagnosticBookingModal';

const Diagnosis = () => {
  const [tests, setTests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [activeInfo, setActiveInfo] = useState(null);

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
    {
      name: 'Complete Blood Picture (CBP)',
      category: 'Hematology',
      price: 250,
      report_time: 12,
      img: 'https://images.unsplash.com/photo-1579152276502-745f467599ee?auto=format&fit=crop&q=80&w=400',
      description: 'Comprehensive analysis of red/white cells and platelets. Fasting not strictly required but recommended.'
    },
    {
      name: 'Blood Glucose (Sugar)',
      category: 'Biochemistry',
      price: 150,
      report_time: 6,
      img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=400',
      description: 'Standard test for diabetes monitoring. 8-10 hours fasting required for accurate results.'
    },
    {
      name: 'Thyroid Profile (T3/T4/TSH)',
      category: 'Hormonal',
      price: 450,
      report_time: 24,
      img: 'https://images.unsplash.com/photo-1511174511562-5f7f185854c8?auto=format&fit=crop&q=80&w=400',
      description: 'Evaluates thyroid gland function. Best performed in the morning.'
    },
    {
      name: 'Lipid Profile',
      category: 'Cardiology',
      price: 500,
      report_time: 24,
      img: 'https://images.unsplash.com/photo-1628595304645-83bc3e301272?auto=format&fit=crop&q=80&w=400',
      description: 'Measures cholesterol and triglycerides. Strict 12-hour fasting required.'
    },
    {
      name: 'Liver Function Test',
      category: 'Biochemistry',
      price: 650,
      report_time: 24,
      img: 'https://images.unsplash.com/photo-1579152438830-466d0938397a?auto=format&fit=crop&q=80&w=400',
      description: 'Assesses liver health and protein levels. Avoid alcohol 24 hours prior.'
    },
    {
      name: 'Kidney Function Test',
      category: 'Biochemistry',
      price: 750,
      report_time: 24,
      img: 'https://images.unsplash.com/photo-1647416391456-f331616cda2f?auto=format&fit=crop&q=80&w=400',
      description: 'Measures creatinine and urea. Stay hydrated before the test.'
    },
    {
      name: 'HbA1c',
      category: 'Diabetes',
      price: 450,
      report_time: 24,
      img: 'https://images.unsplash.com/photo-1576086213369-97a306dca664?auto=format&fit=crop&q=80&w=400',
      description: 'Average blood sugar over 3 months. No fasting required.'
    },
    {
      name: 'CRP',
      category: 'Immunology',
      price: 420,
      report_time: 24,
      img: 'https://images.unsplash.com/photo-1581093458791-9f3c3250bb8b?auto=format&fit=crop&q=80&w=400',
      description: 'Detects inflammation in the body. Used for acute clinical assessments.'
    }
  ];

  const handleAiRecommend = async () => {
    if (!aiInput) return;
    setIsAiLoading(true);
    setAiRecommendation(null);
    try {
      const { chatWithAI } = await import('../utils/api');
      const testList = currentTests.map(t => t.name).join(', ');
      const prompt = `Based on these symptoms: "${aiInput}", which of these lab tests from our clinic are most relevant: [${testList}]? Provide a 1-sentence suggestion and pick 1-2 tests. Max 2 sentences.
CRITICAL RULE: You MUST format your precise response as: 
[Telugu Translation]
|||
[English Translation]`;
      const resp = await chatWithAI(prompt);
      setAiRecommendation(resp.data.response);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

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

        <div className="flex flex-col lg:flex-row items-center justify-between mb-12 gap-8">
          <div className="max-w-xl text-center md:text-left">
            <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
              <div className="w-8 h-8 rounded-xl bg-hospital-primary flex items-center justify-center text-white shadow-lg"><Flask size={18} /></div>
              <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-hospital-secondary">Advanced Diagnostics</h4>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-hospital-dark leading-none font-['Noto_Sans_Telugu']">పరిపూర్ణ <span className="text-hospital-secondary italic">ల్యాబ్</span> <br />పరీక్షలు.</h2>
            <p className="text-[10px] uppercase font-bold text-gray-300 tracking-[0.3em] mt-3">Precision Laboratory Insights</p>
            <p className="text-xs font-medium text-gray-500 mt-6 font-['Noto_Sans_Telugu'] italic">WHO-ధృవీకరించబడిన డయాగ్నోస్టిక్ సెంటర్ | ఎం.జి రోడ్డు, సూర్యాపేట</p>
          </div>

          <div className="flex flex-col gap-4 w-full md:w-[450px]">
            <div className="bg-hospital-dark p-6 rounded-[32px] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 text-white/5 group-hover:rotate-12 transition-transform"><Sparkles size={100} /></div>
              <p className="text-[8px] font-black uppercase tracking-[0.3em] text-hospital-primary mb-3">AI Test Scout v1.2</p>
              <h4 className="text-xs font-black mb-4">Not sure which test to take? Ask AI.</h4>
              <div className="relative">
                <input value={aiInput} onChange={(e) => setAiInput(e.target.value)} type="text" placeholder="Describe symptoms (e.g. fever, fatigue)..."
                  className="w-full bg-white/10 border-none p-4 rounded-2xl text-[10px] text-white outline-none focus:ring-2 ring-hospital-primary/50 transition-all font-bold" />
                <button onClick={handleAiRecommend} disabled={isAiLoading} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-hospital-primary rounded-xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all">
                  {isAiLoading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <ArrowRight size={16} />}
                </button>
              </div>
              {aiRecommendation && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                  {aiRecommendation.includes('|||') ? (
                    <>
                      <p className="text-[11px] font-bold leading-relaxed text-white font-['Noto_Sans_Telugu']">{aiRecommendation.split('|||')[0].trim()}</p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-hospital-primary opacity-80 mt-2">{aiRecommendation.split('|||')[1].trim()}</p>
                    </>
                  ) : (
                    <p className="text-[11px] font-bold leading-relaxed text-white font-['Noto_Sans_Telugu']">{aiRecommendation}</p>
                  )}
                </motion.div>
              )}
            </div>
            <div className="relative group w-full">
              <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-hospital-primary/40 group-focus-within:text-hospital-primary transition-all z-10" />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} type="text" placeholder="Manual catalog search..."
                className="w-full bg-white border-2 border-transparent focus:border-hospital-primary/20 shadow-xl p-5 pl-14 rounded-[32px] outline-none text-sm font-bold transition-all" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredTests.map((test, index) => (
            <motion.div key={index}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{
                y: -10,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
              }}
              className="bg-white rounded-[40px] border-2 border-transparent hover:border-hospital-primary/10 shadow-sm transition-all group relative overflow-hidden h-full flex flex-col cursor-pointer"
            >
              <div className="relative w-full h-48 overflow-hidden bg-gray-100">
                <img src={test.img || 'https://images.unsplash.com/photo-1511174511562-5f7f185854c8?auto=format&fit=crop&q=80&w=400'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={test.name} />
                <div className="absolute top-4 right-4 z-20">
                  <button
                    onClick={(e) => { e.stopPropagation(); setActiveInfo(test); }}
                    className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-hospital-dark shadow-xl hover:bg-hospital-primary hover:text-white transition-all ring-4 ring-white/20">
                    <Info size={18} />
                  </button>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white to-transparent"></div>
              </div>

              <div className="p-8 flex-1 flex flex-col pt-4">
                <div className="mb-6 flex-1">
                  <div className="px-3 py-1 bg-hospital-primary/5 rounded-full border border-hospital-primary/10 text-[8px] font-black uppercase tracking-widest text-hospital-primary inline-block mb-3">
                    {test.category}
                  </div>
                  <h3 className="text-lg font-black text-hospital-dark leading-tight line-clamp-2 h-[3rem] font-['Noto_Sans_Telugu']">{test.name}</h3>
                </div>

                <div className="space-y-6 mt-auto">
                  <div className="flex justify-between items-end border-b border-gray-50 pb-4">
                    <div>
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1 leading-none">Price Est.</p>
                      <p className="text-2xl font-black text-hospital-dark tracking-tighter">₹{test.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1 leading-none">Report</p>
                      <p className="text-xs font-black text-hospital-secondary">{test.report_time}H</p>
                    </div>
                  </div>

                  <button onClick={() => { handleBookTest(test); }} className="w-full bg-hospital-dark text-white py-4 rounded-[24px] text-[10px] font-black uppercase tracking-widest shadow-lg group-hover:bg-hospital-primary group-hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 border-none">
                    <Heart size={14} className="group-hover:fill-white transition-all" /> Book Now
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {activeInfo && activeInfo.name === test.name && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute inset-0 z-30 bg-hospital-dark/95 p-8 flex flex-col justify-center text-center backdrop-blur-sm"
                  >
                    <button onClick={(e) => { e.stopPropagation(); setActiveInfo(null); }} className="absolute top-6 right-6 text-white/40 hover:text-white"><X size={24} /></button>
                    <Sparkles className="text-hospital-secondary mx-auto mb-4" size={32} />
                    <h4 className="text-white text-sm font-black uppercase tracking-widest mb-4">Clinical Preparation</h4>
                    <p className="text-white/80 text-xs font-medium leading-relaxed font-['Noto_Sans_Telugu']">{test.description || "Consult physician for specific preparation requirements."}</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { handleBookTest(test); setActiveInfo(null); }}
                      className="mt-8 py-3 px-6 bg-hospital-primary text-white rounded-full text-[10px] font-black uppercase tracking-widest"
                    >
                      Book This Test
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
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
          <div className="absolute top-0 right-0 p-12 text-white/5 pointer-events-none opacity-50"><Flask size={200} /></div>
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
