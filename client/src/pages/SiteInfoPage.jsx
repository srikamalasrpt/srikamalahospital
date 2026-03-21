import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ShieldCheck, FileText, HelpCircle, Phone, Home } from 'lucide-react';

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
  sitemap: {
    title: 'Website Sitemap',
    subtitle: 'Quick access to major pages',
    icon: Home,
    sections: [
      { heading: 'Home', content: '/' },
      { heading: 'Booking', content: '/book' },
      { heading: 'Doctors', content: '/doctors' },
      { heading: 'Reviews', content: '/reviews' },
      { heading: 'Diagnosis', content: '/diagnosis' },
      { heading: 'Medical Shop', content: '/medical-shop' },
      { heading: 'AI Health', content: '/ai-health' },
    ],
  },
};

const SiteInfoPage = () => {
  const { slug } = useParams();
  const page = PAGE_DATA[slug] || PAGE_DATA.about;
  const Icon = page.icon;

  return (
    <section className="min-h-screen bg-[#f8fafc] pt-32 pb-20 px-6">
      <div className="container mx-auto max-w-5xl">
        <div className="bg-white rounded-[36px] border border-gray-100 shadow-sm p-8 md:p-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-hospital-primary/10 text-hospital-primary flex items-center justify-center">
              <Icon size={22} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-hospital-dark">{page.title}</h1>
              <p className="text-xs uppercase tracking-[0.2em] font-bold text-gray-400 mt-1">{page.subtitle}</p>
            </div>
          </div>

          <div className="space-y-6">
            {page.sections.map((section) => (
              <div key={section.heading} className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
                <h3 className="text-sm font-black text-hospital-dark mb-2">{section.heading}</h3>
                <p className="text-sm text-gray-600 font-medium">{section.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link to="/" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-hospital-dark text-white text-xs font-black uppercase tracking-widest hover:bg-hospital-primary transition-colors">
              Back To Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SiteInfoPage;
