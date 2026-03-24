import React from 'react';
import PatientReviews from '../components/PatientReviews';

const ReviewsPage = () => {
    return (
        <div className="pt-32 pb-24 min-h-screen bg-[#050505] relative overflow-hidden">
             {/* Institutional Aura Matrix */}
             <div className="fixed inset-0 z-0 pointer-events-none opacity-20 overflow-hidden">
                <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-hospital-secondary/10 rounded-full blur-[140px] animate-pulse-soft"></div>
            </div>
            <div className="relative z-10">
                <PatientReviews />
            </div>
        </div>
    );
};

export default ReviewsPage;
