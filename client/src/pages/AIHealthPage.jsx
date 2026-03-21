import React from 'react';
import AISymptomChecker from '../components/AISymptomChecker';

const AIHealthPage = () => {
    return (
        <div className="pt-40 pb-24 min-h-screen bg-hospital-background">
            <AISymptomChecker />
        </div>
    );
};

export default AIHealthPage;
