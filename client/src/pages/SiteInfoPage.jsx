import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ShieldCheck, FileText, HelpCircle, Phone, Home, ArrowLeft, Activity, Zap, Sparkles, Scissors, Syringe } from 'lucide-react';
import { motion } from 'framer-motion';

const PAGE_DATA = {
  about: {
    title: 'About Sri Kamala Hospital',
    subtitle: 'Clinical excellence with 24x7 patient support',
    icon: Home,
    sections: [
      {
        heading: 'Who We Are',
        content:
          'Sri Kamala Hospital provides OP consultation, diagnostics, and pharmacy support for patients in and around Suryapet with a strong focus on timely and affordable care.',
      },
      {
        heading: 'Core Services',
        content:
          'General OP consultations, specialist care, laboratory diagnostics, digital receipt/token workflow, and patient follow-up support are available through our integrated system.',
      },
      {
        heading: 'Hospital Contact',
        content:
          'Main: 99480 76665 | Diagnostics: 98668 95634 | Hours: Open 24 Hours',
      },
    ],
  },
  contact: {
    title: 'Contact & Help Desk',
    subtitle: 'Reach hospital support quickly',
    icon: Phone,
    sections: [
      {
        heading: 'Address',
        content: 'Opp. Tirumala Grand Restaurant, M.G. Road, Suryapet',
      },
      {
        heading: 'Phone Numbers',
        content:
          'Hospital OP/Emergency: 99480 76665 | Diagnostics/Lab: 98668 95634',
      },
      {
        heading: 'Working Hours',
        content: 'Open 24 Hours',
      },
    ],
  },
  security: {
    title: 'Website Security',
    subtitle: 'How we protect hospital digital systems',
    icon: ShieldCheck,
    sections: [
      {
        heading: 'Data Protection',
        content:
          'Patient-facing forms are transmitted over HTTPS. Sensitive service credentials are stored in server environment variables.',
      },
      {
        heading: 'Access Controls',
        content:
          'Administrative actions are restricted via authenticated admin login and server-side validation.',
      },
      {
        heading: 'Reporting Security Issues',
        content:
          'For urgent security concerns, contact hospital support at 99480 76665 and request escalation to the technical admin.',
      },
    ],
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    subtitle: 'How patient and visitor data is handled',
    icon: FileText,
    sections: [
      {
        heading: 'Data We Collect',
        content:
          'For booking and receipts we may collect name, phone, age, gender, selected service details, and appointment preferences.',
      },
      {
        heading: 'Purpose of Data Use',
        content:
          'Data is used to generate tokens, manage appointments, and provide operational hospital services.',
      },
      {
        heading: 'Patient Rights',
        content:
          'Patients can request corrections to booking details and report concerns through hospital support channels.',
      },
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    subtitle: 'Service usage terms for website visitors',
    icon: FileText,
    sections: [
      {
        heading: 'Medical Disclaimer',
        content:
          'AI-based outputs are preliminary guidance only. Final diagnosis and treatment must be provided by qualified doctors.',
      },
      {
        heading: 'Booking Terms',
        content:
          'Appointments and diagnostic slots are subject to availability, clinical priority, and hospital verification.',
      },
      {
        heading: 'Receipt & Token Terms',
        content:
          'Digital receipts/tokens should be presented at reception. Queue flow may be adjusted during emergency conditions.',
      },
    ],
  },
  faq: {
    title: 'Frequently Asked Questions',
    subtitle: 'Common patient questions answered',
    icon: HelpCircle,
    sections: [
      {
        heading: 'Can I book diagnostics online?',
        content:
          'Yes. Select a test in the diagnosis page, submit details, and receive a tokenized receipt.',
      },
      {
        heading: 'Are services available 24x7?',
        content:
          'Hospital operations are open 24 hours. Specific specialist availability may vary by schedule.',
      },
      {
        heading: 'How do I contact support?',
        content:
          'Call 99480 76665 for hospital support or 98668 95634 for diagnostics support.',
      },
    ],
  },
};

const SiteInfoPage = () => {
  const { slug } = useParams();
  const page = PAGE_DATA[slug] || PAGE_DATA.about;
  const Icon = page.icon;

  return (
    <section className="min-h-screen bg-[#050505] pt-32 pb-24 px-6 relative overflow-hidden">

      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[10%] left-[10%] w-[600px] h-[600px] bg-hospital-primary/10 rounded-full blur-[140px] animate-pulse-soft"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-hospital-secondary/5 rounded-full blur-[120px] animate-pulse-soft" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        <Link to="/" className="inline-flex items-center gap-4 text-white font-black mb-12 hover:text-hospital-primary transition-all group active:scale-95">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:-translate-x-2 transition-transform shadow-4xl backdrop-blur-3xl">
            <ArrowLeft size={18} />
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.4em] italic leading-none">Institutional Root</span>
        </Link>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-[#0a0a0a] rounded-[60px] border border-white/10 shadow-4xl p-10 md:p-16 relative overflow-hidden backdrop-blur-3xl">

          <div className="absolute top-0 right-0 p-16 opacity-[0.03] rotate-12 text-white"><Icon size={250} /></div>

          <div className="flex items-center gap-6 mb-16 relative z-10">
            <div className="w-16 h-16 rounded-[28px] bg-white/5 border border-white/10 text-hospital-primary flex items-center justify-center shadow-4xl hover:scale-110 transition-transform">
              <Icon size={28} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">{page.title}</h1>
              <div className="flex items-center gap-3 mt-4">
                <div className="h-1 w-10 bg-hospital-primary rounded-full"></div>
                <p className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-600 italic leading-none">{page.subtitle}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8 relative z-10">
            {page.sections.map((section, idx) => (
              <motion.div
                key={section.heading}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="p-10 rounded-[40px] bg-white/5 border border-white/5 hover:border-white/10 group transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:scale-110 transition-transform"><Activity size={80} /></div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-hospital-secondary mb-6 italic leading-none border-l-2 border-hospital-secondary pl-4">{section.heading}</h3>
                <p className="text-xl font-black text-white italic leading-relaxed font-serif opacity-80">"{section.content}"</p>
                <div className="mt-8 flex gap-2">
                  {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/5"></div>)}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 pt-12 border-t border-white/5 italic text-center">
            <p className="text-[9px] font-black text-gray-800 uppercase tracking-[0.8em]">Secure Information Node Sri Kamala Hospitals © 2026</p>
          </div>
        </motion.div>
      </div>

      {/* Local Ambient Decor */}
      <div className="absolute top-[30%] left-[-10%] opacity-[0.02] text-white rotate-12 pointer-events-none scale-150"><Scissors size={300} strokeWidth={1} /></div>
      <div className="absolute bottom-[30%] right-[-10%] opacity-[0.02] text-hospital-secondary -rotate-12 pointer-events-none scale-150"><Syringe size={300} strokeWidth={1} /></div>

    </section>
  );
};

export default SiteInfoPage;
