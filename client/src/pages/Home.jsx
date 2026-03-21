import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import FeatureGrid from '../components/FeatureGrid';
import Stats from '../components/Stats';
import QuickActionGrid from '../components/QuickActionGrid';
import HealthAwareness from '../components/HealthAwareness';
import OPBoard from '../components/OPBoard';
import BMICalculator from '../components/BMICalculator';
import { motion } from 'framer-motion';
import { getConfig } from '../utils/api';

function Home() {
  const [showCoreServices, setShowCoreServices] = useState(true);
  const [showHealthAwareness, setShowHealthAwareness] = useState(true);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    fetchConfig();
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  const fetchConfig = async () => {
    try {
      const resp = await getConfig();
      if (resp.data.success) {
        setShowCoreServices(resp.data.config.showCoreServices !== false);
        setShowHealthAwareness(resp.data.config.showHealthAwareness !== false);
      }
    } catch (err) {
      console.error('Failed to load site config', err);
    }
  };

  return (
    <div className="bg-hospital-background selection:bg-hospital-primary selection:text-white overflow-hidden pb-32">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[10%] right-[15%] w-24 h-24 text-hospital-primary flex items-center justify-center font-black text-6xl opacity-30">+</div>
        <div className="absolute bottom-[20%] left-[10%] w-64 h-64 border-[40px] border-hospital-primary opacity-5 rounded-full blur-2xl"></div>
      </div>

      <main className="relative z-10 pt-20">
        <Hero />
        
        <QuickActionGrid />
        
        {showHealthAwareness && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <HealthAwareness />
           </motion.div>
        )}
        
        <Stats />
        
        <BMICalculator />
        <OPBoard />
        
        {showCoreServices && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <FeatureGrid />
           </motion.div>
        )}
      </main>
    </div>
  );
}

export default Home;
