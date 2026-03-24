import React from 'react';
import Doctors from '../components/Doctors';

const DoctorsPage = () => {
    return (
        <div className="pt-32 pb-24 min-h-screen bg-slate-50 relative overflow-hidden font-['Outfit']">
             {/* Dynamic Aura Node */}
             <div className="fixed inset-0 z-0 pointer-events-none opacity-20 overflow-hidden">
                <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-hospital-primary/5 rounded-full blur-[140px] animate-pulse-soft"></div>
            </div>
            <div className="relative z-10">
                <Doctors />
            </div>
        </div>
    );
};

export default DoctorsPage;
