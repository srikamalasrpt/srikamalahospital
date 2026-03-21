import React from 'react';
import { Calendar, Phone, MapPin, FlaskConical, ChevronRight, Activity, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const QuickActionGrid = () => {
    const actions = [
        { title: 'Book Appointment', telugu: 'అపాయింట్‌మెంట్', description: 'Real-time slot confirmation.', icon: <Calendar size={20} />, link: '/book', color: 'bg-emerald-500', iconColor: 'text-emerald-500', text: 'text-white' },
        { title: 'Emergency Contact', telugu: 'అత్యవసర విభాగం', description: 'Immediate 24/7 casualty help.', icon: <Phone size={20} />, link: 'tel:+919154404051', color: 'bg-rose-500', iconColor: 'text-rose-500', text: 'text-white' },
        { title: 'Find Our Clinic', telugu: 'మా క్లినిక్ కనుగొనండి', description: 'Visit our hospital in person.', icon: <MapPin size={20} />, link: 'https://maps.google.com', color: 'bg-blue-500', iconColor: 'text-blue-500', text: 'text-white' },
        { title: 'Book Blood Test', telugu: 'రక్త పరీక్షలు', description: 'Precision clinical diagnosis.', icon: <FlaskConical size={20} />, link: '/diagnosis', color: 'bg-amber-500', iconColor: 'text-amber-500', text: 'text-white' },
    ];

    return (
        <section className="py-12 px-6 bg-white relative">
            <div className="container mx-auto max-w-7xl">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {actions.map((action, i) => (
                        <motion.div key={i} whileHover={{ y: -6 }} transition={{ duration: 0.6, type: 'spring' }}
                            className={`group relative p-6 rounded-[32px] shadow-xl overflow-hidden cursor-pointer ${action.color} ${action.text}`}>
                            <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-bl-full translate-x-5 -translate-y-5 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700"></div>
                            
                            <div className="relative z-10">
                                <div className="mb-6 w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
                                    <div className={action.iconColor}>{action.icon}</div>
                                </div>
                                
                                <h3 className="text-xl font-bold font-['Noto_Sans_Telugu'] mb-1 break-words leading-none">{action.telugu}</h3>
                                <p className="text-[9px] uppercase font-black tracking-widest opacity-40 mb-3">{action.title}</p>
                                
                                {action.link.startsWith('http') || action.link.startsWith('tel') ? (
                                    <a href={action.link} className="inline-flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.2em] opacity-60 hover:opacity-100 transition-all">
                                        GO <ArrowUpRight size={10} />
                                    </a>
                                ) : (
                                    <Link to={action.link} className="inline-flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.2em] opacity-60 hover:opacity-100 transition-all">
                                        GO <ChevronRight size={10} />
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default QuickActionGrid;
