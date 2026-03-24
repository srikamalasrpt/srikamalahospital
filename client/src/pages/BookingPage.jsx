import React from 'react';
import BookingForm from '../components/BookingForm';

const BookingPage = () => {
    return (
        <div className="pt-32 pb-24 min-h-screen bg-[#050505] relative overflow-hidden">
            {/* Ambient Clinical Aura */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-20 overflow-hidden">
                <div className="absolute top-[15%] right-[20%] w-[500px] h-[500px] bg-hospital-primary/10 rounded-full blur-[140px] animate-pulse-soft"></div>
                <div className="absolute bottom-[25%] left-[15%] w-[400px] h-[400px] bg-hospital-secondary/10 rounded-full blur-[120px] animate-pulse-soft" style={{ animationDelay: '3s' }}></div>
            </div>

            <div className="relative z-10">
                <BookingForm />
            </div>
        </div>
    );
};

export default BookingPage;
