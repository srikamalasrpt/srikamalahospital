import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Filter, Bookmark, Package, Pill, HeartPulse, Activity, Plus, ChevronRight, Info, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchPharmacyProducts } from '../utils/api';

const MedicalShop = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetchPharmacyProducts();
        setProducts(response.data.success ? response.data.products : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleAiAsk = async () => {
    if (!aiInput) return;
    setIsAiLoading(true);
    setAiInsight('');
    try {
      const { chatWithAI } = await import('../utils/api');
      const stock = products.map(p => p.name).join(', ');
      const prompt = `Medicine Inquiry: "${aiInput}". Our stock: [${stock}]. Briefly explain if we have it or a similar alternative, and its primary clinical use. Max 2 sentences.
CRITICAL RULE: You MUST format your response as:
[Telugu Translation]
|||
[English Translation]`;
      const resp = await chatWithAI(prompt);
      setAiInsight(resp.data.response);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-32 pb-20 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-hospital-secondary/5 rounded-bl-[400px] z-0 pointer-events-none"></div>

      <div className="container mx-auto max-w-7xl relative z-10">

        <div className="flex flex-col lg:flex-row items-center justify-between mb-12 gap-12">
          <div className="max-w-xl text-center lg:text-left">
            <div className="flex items-center gap-3 mb-6 justify-center lg:justify-start">
              <div className="w-8 h-8 rounded-xl bg-hospital-secondary flex items-center justify-center text-white shadow-lg"><Pill size={18} /></div>
              <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-hospital-primary">Hospital Pharmacy</h4>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-hospital-dark leading-none font-['Noto_Sans_Telugu']">మెడికల్ <span className="text-hospital-secondary italic">షాప్</span> <br />మరియు మందులు.</h2>
            <p className="text-[10px] uppercase font-bold text-gray-300 tracking-[0.3em] mt-3">Internal Medicine & Apothecary</p>
            <p className="text-xs font-medium text-gray-500 mt-6 leading-relaxed font-['Noto_Sans_Telugu']">రోగుల కోసం ధృవీకరించబడిన మెడిసిన్ స్టాక్.</p>
          </div>

          <div className="flex flex-col gap-4 w-full lg:w-[450px]">
            <div className="bg-hospital-dark p-6 rounded-[32px] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 text-white/5 opacity-10 group-hover:rotate-12 transition-transform"><Pill size={100} /></div>
              <p className="text-[8px] font-black uppercase tracking-[0.3em] text-hospital-secondary mb-3">Pharmacy AI Advisor v2.0</p>
              <h4 className="text-xs font-black mb-4">Ask about medicine usage or alternatives.</h4>
              <div className="relative">
                <input value={aiInput} onChange={(e) => setAiInput(e.target.value)} type="text" placeholder="e.g. 'Can I take Paracetamol for fever?'..."
                  className="w-full bg-white/10 border-none p-4 rounded-2xl text-[10px] text-white outline-none focus:ring-2 ring-hospital-secondary/50 transition-all font-bold" />
                <button onClick={handleAiAsk} disabled={isAiLoading} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-hospital-secondary rounded-xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all">
                  {isAiLoading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <ArrowRight size={16} />}
                </button>
              </div>
              {aiInsight && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                  {aiInsight.includes('|||') ? (
                    <>
                       <p className="text-[11px] font-bold leading-relaxed text-white font-['Noto_Sans_Telugu']">{aiInsight.split('|||')[0].trim()}</p>
                       <p className="text-[9px] font-black uppercase tracking-widest text-hospital-secondary opacity-80 mt-2">{aiInsight.split('|||')[1].trim()}</p>
                    </>
                  ) : (
                    <p className="text-[11px] font-bold leading-relaxed text-white font-['Noto_Sans_Telugu']">{aiInsight}</p>
                  )}
                </motion.div>
              )}
            </div>
            <div className="relative group w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
              <input type="text" placeholder="మందుల కోసం వెతకండి (e.g. Paracetamol)" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-100 p-4 pl-12 rounded-[28px] shadow-lg outline-none text-sm font-black transition-all placeholder:text-gray-200" />
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-8 h-8 border-4 border-hospital-secondary/20 border-t-hospital-secondary rounded-full mb-4"></motion.div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Scanning Stock...</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div key={index} whileHover={{ y: -6 }} transition={{ duration: 0.8, type: 'spring' }}
                  className="bg-white rounded-[40px] p-6 border border-gray-100 shadow-md hover:shadow-xl group relative overflow-hidden flex flex-col items-center text-center">

                  <div className="w-full aspect-square bg-gray-50 rounded-[32px] overflow-hidden mb-6 border-2 border-white shadow-lg relative flex items-center justify-center p-6 group-hover:bg-hospital-primary/5 transition-colors">
                    <div className="text-hospital-primary scale-[2] opacity-10 group-hover:scale-[2.5] transition-transform duration-1000">
                      <Package size={48} strokeWidth={1} />
                    </div>
                    <div className="absolute top-3 right-3 text-[7px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-['Noto_Sans_Telugu']">అందుబాటులో ఉంది</div>
                  </div>

                  <div className="mb-8 w-full">
                    <p className="text-[7px] font-black uppercase tracking-[0.2em] text-hospital-secondary mb-1">{product.category}</p>
                    <h3 className="text-lg font-black text-hospital-dark line-clamp-1 leading-none tracking-tight font-['Noto_Sans_Telugu']">{product.name}</h3>
                    <div className="mt-4">
                      <p className="text-xl font-black text-hospital-dark tabular-nums">₹{product.price}</p>
                    </div>
                  </div>

                  <button className="w-full flex items-center justify-center gap-2 p-3 bg-gray-50 text-gray-400 font-black text-[9px] uppercase tracking-widest rounded-full hover:bg-hospital-primary hover:text-white transition-all shadow-md">
                    <Info size={14} /> <span className="font-['Noto_Sans_Telugu'] text-xs font-black tracking-normal">వివరాలు</span>
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-16 text-center">
        <p className="text-gray-400 text-[10px] font-medium italic font-['Noto_Sans_Telugu']">* మందుల స్టాక్ మార్పుకు లోబడి ఉంటుంది. దయచేసి ప్రిస్క్రిప్షన్ కోసం మీ వైద్యుడిని సంప్రదించండి.</p>
        <p className="text-[7px] uppercase font-bold text-gray-300 tracking-[0.2em] mt-2">Professional Prescription Required for Restricted Items</p>
      </div>
    </div>
  );
};

export default MedicalShop;
