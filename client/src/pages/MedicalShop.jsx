import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Filter, Bookmark, Package, Pill, HeartPulse, Activity, Plus, ChevronRight, Info, Sparkles, ArrowRight, X, Scissors, Syringe, Droplets } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchPharmacyProducts } from '../utils/api';

const MedicalShop = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState('');
  const [activeInfo, setActiveInfo] = useState(null);

  const fallbackProducts = [
    { 
      name: 'Paracetamol 650mg', 
      category: 'Analgesics', 
      price: 25,
      img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400',
      description: 'Used for fever and mild to moderate pain relief. Safe for most adults when taken as directed.'
    },
    { 
      name: 'Amoxicillin 500mg', 
      category: 'Antibiotics', 
      price: 120,
      img: 'https://images.unsplash.com/photo-1471864190281-ad5fe9bb072c?auto=format&fit=crop&q=80&w=400',
      description: 'Broad-spectrum antibiotic for bacterial infections. Requires a valid doctor prescription.'
    },
    { 
      name: 'Cetirizine 10mg', 
      category: 'Allergy', 
      price: 45,
      img: 'https://images.unsplash.com/photo-1631549916768-4119b255f946?auto=format&fit=crop&q=80&w=400',
      description: 'Non-drowsy antihistamine for hay fever, allergies, and cold symptoms.'
    },
    { 
      name: 'Pantoprazole 40mg', 
      category: 'Gastritis', 
      price: 90,
      img: 'https://images.unsplash.com/photo-1550572017-ed2302ca3f8c?auto=format&fit=crop&q=80&w=400',
      description: 'Reduces stomach acid. Used for GERD, acidity, and heart burn. Take 30 mins before food.'
    },
    { 
      name: 'ORS Sachet (Orange)', 
      category: 'Wellness', 
      price: 15,
      img: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&q=80&w=400',
      description: 'World Health Organization formula for rehydration during fever or dehydration.'
    },
    { 
      name: 'Multivitamin Complex', 
      category: 'Supplements', 
      price: 180,
      img: 'https://images.unsplash.com/photo-1626202341506-89772589363a?auto=format&fit=crop&q=80&w=400',
      description: 'Essential vitamins and minerals for daily health and immunity support.'
    }
  ];

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

  const currentProducts = (products && products.length > 0) ? products : fallbackProducts;

  const handleAiAsk = async () => {
    if (!aiInput) return;
    setIsAiLoading(true);
    setAiInsight('');
    try {
      const { chatWithAI } = await import('../utils/api');
      const stock = currentProducts.map(p => p.name).join(', ');
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

  const filteredProducts = currentProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-6 relative overflow-hidden">
      
      {/* Background Decor Matrices */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[10%] right-[15%] w-[600px] h-[600px] bg-hospital-secondary/10 rounded-full blur-[140px] animate-pulse-soft"></div>
        <div className="absolute bottom-[20%] left-[10%] w-[500px] h-[500px] bg-hospital-primary/5 rounded-full blur-[120px] animate-pulse-soft" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">

        <div className="flex flex-col lg:flex-row items-center justify-between mb-20 gap-12">
          <div className="max-w-xl text-center lg:text-left">
            <div className="flex items-center gap-4 mb-10 justify-center lg:justify-start">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-hospital-secondary shadow-4xl"><Pill size={28} /></div>
              <div>
                <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-hospital-primary">In-House Clinical Apothecary</h4>
                <p className="text-[8px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-1 italic">Verified Medication Protocol Unit</p>
              </div>
            </div>
            <h2 className="text-4xl lg:text-8xl font-black text-white leading-[0.85] tracking-tighter font-['Noto_Sans_Telugu'] mb-8">మెడికల్ <span className="text-hospital-secondary italic font-serif">షాప్</span> <br />మరియు మందులు.</h2>
            <p className="text-[11px] uppercase font-bold text-gray-500 tracking-[0.8em] mt-4 mb-10">SRI KAMALA PHARMA INTELLIGENCE CORE</p>
            <p className="text-sm font-medium text-gray-500 font-serif italic max-w-sm">"Deploying verified pharmaceutical logistics with integrated AI consultation for secure medical distribution."</p>
          </div>

          <div className="flex flex-col gap-8 w-full lg:w-[500px]">
            <div className="bg-[#0a0a0a] border border-white/10 p-10 rounded-[50px] text-white shadow-4xl relative overflow-hidden group backdrop-blur-3xl">
              <div className="absolute top-0 right-0 p-8 text-hospital-secondary opacity-10 group-hover:scale-125 transition-transform duration-1000"><Pill size={120} /></div>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-hospital-secondary mb-4 opacity-70 italic">Pharmacy AI Advisor v3.0</p>
              <h4 className="text-sm font-black mb-6 uppercase tracking-widest text-white/80 italic leading-none">Autonomous Clinical Drug Consultation</h4>
              <div className="relative">
                <input value={aiInput} onChange={(e) => setAiInput(e.target.value)} type="text" placeholder="e.g. 'Can I take Paracetamol for fever?'..."
                  className="w-full bg-white/5 border border-white/10 p-6 rounded-3xl text-[12px] text-white outline-none focus:ring-2 ring-hospital-secondary/30 transition-all font-bold placeholder:text-gray-600" />
                <button onClick={handleAiAsk} disabled={isAiLoading} className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-hospital-secondary text-black rounded-2xl flex items-center justify-center hover:bg-white active:scale-90 transition-all shadow-neon-secondary">
                  {isAiLoading ? <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div> : <ArrowRight size={20} />}
                </button>
              </div>
              <AnimatePresence>
                {aiInsight && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-6 bg-white/5 rounded-3xl border border-white/10 relative z-10 font-serif">
                    {aiInsight.includes('|||') ? (
                      <>
                         <p className="text-[14px] font-bold leading-relaxed text-white font-['Noto_Sans_Telugu'] mb-3 italic">"{aiInsight.split('|||')[0].trim()}"</p>
                         <div className="h-px bg-white/5 mb-3 w-1/3"></div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-hospital-secondary opacity-90 italic leading-snug">{aiInsight.split('|||')[1].trim()}</p>
                      </>
                    ) : (
                      <p className="text-[14px] font-bold leading-relaxed text-white font-['Noto_Sans_Telugu'] italic">"{aiInsight}"</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="relative group w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-hospital-secondary/40 group-focus-within:text-hospital-secondary transition-all z-10" size={24} />
              <input type="text" placeholder="Search Molecular Catalog (e.g. Paracetamol)..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-hospital-secondary/30 shadow-4xl p-7 pl-16 rounded-[40px] outline-none text-base font-bold transition-all text-white placeholder:text-gray-600 backdrop-blur-3xl" />
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="w-12 h-12 border-2 border-hospital-secondary/10 border-t-hospital-secondary rounded-full mb-6 shadow-neon-secondary"></motion.div>
              <p className="text-[11px] font-black uppercase tracking-[0.5em] text-gray-500 animate-pulse">Scanning Apothecary Nodes...</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {filteredProducts.map((product, index) => (
                <motion.div key={index} whileHover={{ y: -15 }} transition={{ duration: 1, type: 'spring' }}
                  className="bg-white/5 rounded-[50px] p-10 border border-white/5 shadow-4xl group relative overflow-hidden flex flex-col items-center backdrop-blur-3xl hover:border-white/20 active:scale-95 transition-all duration-700">

                  <div className="w-full aspect-square bg-white/5 rounded-[40px] overflow-hidden mb-8 relative border border-white/10 shadow-inner">
                    <img src={product.img || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400'} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-115 grayscale group-hover:grayscale-0" alt={product.name} />
                    <div className="absolute top-4 right-4 text-[9px] font-black text-hospital-secondary bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full font-['Noto_Sans_Telugu'] shadow-2xl border border-white/10 italic">అందుబాటులో ఉంది</div>
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>

                  <div className="mb-10 w-full text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-hospital-secondary mb-3 opacity-60 italic">{product.category}</p>
                    <h3 className="text-xl font-black text-white line-clamp-1 leading-none tracking-tighter font-['Noto_Sans_Telugu'] group-hover:text-hospital-secondary transition-colors mb-4">{product.name}</h3>
                    <div className="flex items-center justify-center gap-3">
                      <p className="text-3xl font-black text-white tracking-tighter tabular-nums underline decoration-hospital-secondary/30">₹{product.price}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveInfo(product)}
                    className="group/btn w-full flex items-center justify-center gap-4 py-5 bg-white text-black font-black text-[11px] uppercase tracking-[0.4em] rounded-[28px] hover:bg-hospital-secondary hover:text-black transition-all shadow-4xl border-none relative overflow-hidden">
                    <span className="relative z-10 flex items-center gap-2"><Info size={16} /> <span className="font-['Noto_Sans_Telugu'] text-base font-black tracking-normal">వివరాలు</span></span>
                    <div className="absolute inset-0 bg-hospital-secondary opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                  </button>

                  <AnimatePresence>
                    {activeInfo && activeInfo.name === product.name && (
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-30 bg-black/95 p-10 flex flex-col justify-center text-center backdrop-blur-xl border border-hospital-secondary/20 rounded-[50px]"
                      >
                        <button onClick={() => setActiveInfo(null)} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"><X size={32} strokeWidth={1} /></button>
                        <Sparkles className="text-hospital-secondary mx-auto mb-6 animate-pulse" size={48} />
                        <h4 className="text-white text-[11px] font-black uppercase tracking-[0.5em] mb-6">Molecular Insight Node</h4>
                        <p className="text-gray-300 text-sm font-medium leading-relaxed font-serif italic mb-10">"{product.description || "Consult clinical specialist for specific molecular distribution protocols."}"</p>
                        <button onClick={() => setActiveInfo(null)} className="mt-4 py-5 px-10 bg-white text-black rounded-full text-[11px] font-black uppercase tracking-widest shadow-neon-secondary hover:bg-hospital-secondary transition-colors font-black">ACKNOWLEDGE NODE</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-24 text-center">
        <p className="text-gray-500 text-[11px] font-medium italic font-serif leading-loose">* Clinical stock cycles are subject to real-time verification status. <br />Professional medical prescription required for restricted molecular distributions.</p>
        <p className="text-[9px] uppercase font-bold text-gray-700 tracking-[0.4em] mt-6 italic">Secure Institutional Apothecary Compliance v3.0</p>
      </div>

       {/* Local Background Decor */}
       <div className="absolute top-1/2 right-[-5%] opacity-[0.03] text-white rotate-12 pointer-events-none"><Scissors size={180} /></div>
       <div className="absolute bottom-0 left-[-5%] opacity-[0.03] text-hospital-secondary -rotate-12 pointer-events-none"><Droplets size={160} /></div>
       <div className="absolute top-1/4 left-1/2 -translate-x-1/2 opacity-[0.01] text-white pointer-events-none"><Plus size={400} /></div>

    </div>
  );
};

export default MedicalShop;
