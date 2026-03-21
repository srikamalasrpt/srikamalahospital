import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HealthBot from './components/HealthBot';
import Footer from './components/Footer';
import Home from './pages/Home';
import Diagnosis from './pages/Diagnosis';
import MedicalShop from './pages/MedicalShop';
import AdminDashboard from './pages/AdminDashboard';
import Receipt from './pages/Receipt';
import BookingPage from './pages/BookingPage';
import DoctorsPage from './pages/DoctorsPage';
import ReviewsPage from './pages/ReviewsPage';
import AIHealthPage from './pages/AIHealthPage';
import SiteInfoPage from './pages/SiteInfoPage';

const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

const Layout = ({ children }) => {
    const { pathname } = useLocation();
    const isAdmin = pathname === '/6665';

    return (
        <div className="relative selection:bg-primary/30 selection:text-hospital-dark">
            <ScrollToTop />
            {!isAdmin && <Navbar />}
            
            <main className="min-h-screen">
                {children}
            </main>
            
            {!isAdmin && (
                <>
                    <HealthBot />
                    <Footer />
                </>
            )}
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/book" element={<BookingPage />} />
                    <Route path="/doctors" element={<DoctorsPage />} />
                    <Route path="/reviews" element={<ReviewsPage />} />
                    <Route path="/diagnosis" element={<Diagnosis />} />
                    <Route path="/medical-shop" element={<MedicalShop />} />
                    <Route path="/ai-health" element={<AIHealthPage />} />
                    <Route path="/info/:slug" element={<SiteInfoPage />} />
                    <Route path="/6665" element={<AdminDashboard />} />
                    <Route path="/receipt" element={<Receipt />} />
                    <Route path="/contact.html" element={<Navigate to="/" replace />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Layout>
        </Router>
    );
};

export default App;
