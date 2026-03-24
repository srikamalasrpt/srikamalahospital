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
    <div className="bg-white min-h-screen selection:bg-hospital-primary selection:text-white overflow-hidden pb-40 relative font-['Plus_Jakarta_Sans']">

      {/* Dynamic Clinical Matrix */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[10%] right-[10%] w-[600px] h-[600px] bg-hospital-primary/10 rounded-full blur-[160px] animate-pulse-soft"></div>
        <div className="absolute bottom-[20%] left-[5%] w-[500px] h-[500px] bg-hospital-secondary/5 rounded-full blur-[140px] animate-pulse-soft" style={{ animationDelay: '3s' }}></div>
      </div>

      <main className="relative z-10">

        {/* Global Hub Architecture */}
        <section id="hero" className="relative group">
          <Hero />
        </section>

        <section id="actions" className="relative -mt-32 md:-mt-48 px-6 group z-20">
          <QuickActionGrid />
        </section>

        <section id="dashboard" className="relative py-20 group">
          <ClinicalPulseDashboard />
        </section>

        {showCoreServices && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            id="services"
          >
            <FeatureGrid />
          </motion.div>
        )}

        <section id="doctors" className="relative py-20 group">
          <Doctors />
        </section>

        <section id="registry" className="relative py-20 group">
          <div className="container mx-auto max-w-7xl px-6">
            <OPBoard />
          </div>
        </section>

        <section id="reviews" className="relative py-20 group">
          <PatientReviews />
        </section>

      </main>

      {/* Global Decor Nodes */}
      <div className="absolute top-1/2 left-[-10%] opacity-[0.02] text-slate-900 pointer-events-none -rotate-12"><Plus size={400} /></div>
      <div className="absolute bottom-[10%] right-[-10%] opacity-[0.02] text-hospital-secondary pointer-events-none rotate-12"><Heart size={350} /></div>

    </div>
  );
}

export default Home;
