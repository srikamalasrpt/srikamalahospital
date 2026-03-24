import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import FeatureGrid from '../components/FeatureGrid';
import QuickActionGrid from '../components/QuickActionGrid';
import OPBoard from '../components/OPBoard';
import PatientReviews from '../components/PatientReviews';
import Doctors from '../components/Doctors';
import ClinicalPulseDashboard from '../components/ClinicalPulseDashboard';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Heart } from 'lucide-react';
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
    <div className="bg-slate-50 selection:bg-hospital-primary selection:text-black overflow-hidden pb-40 relative font-['Outfit']">

      {/* Dynamic Clinical Layering Matrix */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[15%] right-[20%] w-[500px] h-[500px] bg-hospital-primary/5 rounded-full blur-[140px] animate-pulse-soft"></div>
        <div className="absolute bottom-[25%] left-[15%] w-[400px] h-[400px] bg-hospital-secondary/5 rounded-full blur-[120px] animate-pulse-soft" style={{ animationDelay: '3s' }}></div>
      </div>

      <main className="relative z-10">

        {/* Core Sections Matrix */}
        <section id="hero" className="relative group">
          <Hero />
        </section>

        <section id="dashboard" className="relative -mt-24 group">
          <ClinicalPulseDashboard />
        </section>

        <section id="actions" className="relative group">
          <QuickActionGrid />
        </section>

        <section id="doctors" className="relative group">
          <Doctors />
        </section>

        <section id="registry" className="relative group">
          <OPBoard />
        </section>

        {showCoreServices && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            id="services"
          >
            <FeatureGrid />
          </motion.div>
        )}

        <section id="reviews" className="relative group mt-20">
          <PatientReviews />
        </section>

      </main>

      {/* Global Clinical Decor Elements - Procedural Complements */}
      <div className="absolute top-[50%] right-[-100px] opacity-[0.02] text-white rotate-45 pointer-events-none group-hover:rotate-90 transition-transform duration-[3000ms]"><Plus size={400} strokeWidth={0.5} /></div>
      <div className="absolute bottom-[10%] left-[-80px] opacity-[0.02] text-hospital-secondary -rotate-12 pointer-events-none"><Heart size={350} strokeWidth={0.5} /></div>

    </div>
  );
}

export default Home;
