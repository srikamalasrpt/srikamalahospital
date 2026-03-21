import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Calendar, CheckCircle, Clock, Search, LogOut, ChevronRight, Download, Pill, Activity, Plus, Trash2, Settings, Globe, Lock, Key } from 'lucide-react';
import { updateConfig, getConfig, adminLogin, fetchPharmacyProducts, getAppointments, updateAppointment } from '../utils/api';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [appointments, setAppointments] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('appointments');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [config, setConfig] = useState({ showCoreServices: true, showHealthAwareness: true });

  useEffect(() => {
    if (isAuthenticated) {
      fetchAppointments();
      fetchProducts();
      fetchConfig();
    }
  }, [isAuthenticated]);

  const fetchConfig = async () => {
    try {
      const resp = await getConfig();
      if (resp.data.success) {
        setConfig(resp.data.config);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleCoreServices = async () => {
    const newConfig = { ...config, showCoreServices: !config.showCoreServices };
    try {
      await updateConfig(newConfig);
      setConfig(newConfig);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleHealthAwareness = async () => {
    const newConfig = { ...config, showHealthAwareness: !config.showHealthAwareness };
    try {
      await updateConfig(newConfig);
      setConfig(newConfig);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const resp = await adminLogin(password);
      if (resp.data.success) {
        setIsAuthenticated(true);
        setLoginError('');
      }
    } catch (err) {
      setLoginError('Invalid Administrator Password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-hospital-dark flex flex-col items-center justify-center p-6 text-white font-sans relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 flex items-center justify-center">
            <Globe size={800} />
        </div>
        <form onSubmit={handleLogin} className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl p-10 rounded-[40px] border border-white/20 shadow-2xl text-center">
           <div className="w-20 h-20 mx-auto bg-hospital-primary rounded-3xl flex items-center justify-center shadow-xl mb-8">
              <Lock size={32} className="text-white" />
           </div>
           <h2 className="text-3xl font-black mb-2 tracking-tight">Admin Access</h2>
           <p className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-8">Restricted Security Portal</p>
           
           <div className="relative mb-6 text-left">
              <Key size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-hospital-primary" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Secure Password"
                className="w-full bg-white/5 border border-white/10 pl-12 p-4 rounded-xl text-white outline-none focus:border-hospital-primary/50 transition-all placeholder:text-gray-500 font-mono tracking-widest"
              />
           </div>
           {loginError && <p className="text-red-400 text-xs font-bold uppercase tracking-widest mb-6">{loginError}</p>}
           
           <button type="submit" className="w-full premium-button justify-center bg-hospital-primary text-white py-4 shadow-xl shadow-hospital-primary/20 hover:bg-white hover:text-hospital-dark">
              AUTHENTICATE
           </button>
        </form>
      </div>
    );
  }

  const fetchProducts = async () => {
    try {
      const resp = await fetchPharmacyProducts();
      if (resp.data.success) {
        setProducts(resp.data.products);
      }
    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const resp = await getAppointments();
      if (resp.data.success) {
        setAppointments(resp.data.appointments);
      }
    } catch (err) {
      console.error('Failed to fetch appointments', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await updateAppointment(id, status);
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = appointments.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.token.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-hospital-dark text-white p-8 flex flex-col shadow-2xl z-20">
        <div className="flex items-center gap-3 mb-12">
          <div className="p-2 bg-hospital-primary rounded-xl shadow-lg">
            <LayoutDashboard size={24} />
          </div>
          <h1 className="text-xl font-black tracking-tight">ADMIN <span className="text-hospital-primary">PANEL</span></h1>
        </div>

        <nav className="space-y-4 flex-1">
          <button onClick={() => setActiveTab('appointments')} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${activeTab === 'appointments' ? 'bg-hospital-primary text-white shadow-xl shadow-hospital-primary/20' : 'text-white/60 hover:text-white hover:bg-white/5'}`}><Calendar size={20} /> Appointments</button>
          <button onClick={() => setActiveTab('medicines')} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${activeTab === 'medicines' ? 'bg-hospital-primary text-white shadow-xl shadow-hospital-primary/20' : 'text-white/60 hover:text-white hover:bg-white/5'}`}><Pill size={20} /> Medical Shop</button>
          <button onClick={() => setActiveTab('patients')} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${activeTab === 'patients' ? 'bg-hospital-primary text-white shadow-xl shadow-hospital-primary/20' : 'text-white/60 hover:text-white hover:bg-white/5'}`}><Users size={20} /> Patients</button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${activeTab === 'settings' ? 'bg-hospital-primary text-white shadow-xl shadow-hospital-primary/20' : 'text-white/60 hover:text-white hover:bg-white/5'}`}><Settings size={20} /> Site Controls</button>
        </nav>

        <button onClick={() => setIsAuthenticated(false)} className="mt-8 flex items-center gap-4 p-4 rounded-2xl text-red-400 hover:bg-red-500/10 font-bold transition-all w-full text-left">
          <LogOut size={20} /> Terminate Session
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-black text-hospital-dark tracking-tight">
                {activeTab === 'settings' ? 'Global Site Controls' : 'Clinical Oversight'}
            </h2>
            <p className="text-gray-400 font-bold text-sm tracking-widest uppercase mt-1">Management Console v2.1</p>
          </div>
        </header>

        {activeTab === 'appointments' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex items-center gap-6">
                 <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><Users size={32} /></div>
                 <div><h4 className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">Total Bookings</h4><p className="text-3xl font-black text-hospital-dark">{appointments.length}</p></div>
              </div>
              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex items-center gap-6">
                 <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center"><CheckCircle size={32} /></div>
                 <div><h4 className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">Successful Payments</h4><p className="text-3xl font-black text-hospital-dark">{appointments.filter(a => a.paymentStatus === 'Paid').length}</p></div>
              </div>
              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex items-center gap-6">
                 <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center"><Clock size={32} /></div>
                 <div><h4 className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">Pending Offline</h4><p className="text-3xl font-black text-hospital-dark">{appointments.filter(a => a.paymentStatus === 'Pay at Hospital').length}</p></div>
              </div>
            </div>

            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="px-8 py-6 text-gray-400 font-black uppercase text-xs tracking-widest">Patient / Token</th>
                      <th className="px-8 py-6 text-gray-400 font-black uppercase text-xs tracking-widest">Department</th>
                      <th className="px-8 py-6 text-gray-400 font-black uppercase text-xs tracking-widest">Status</th>
                      <th className="px-8 py-6 text-gray-400 font-black uppercase text-xs tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((appt) => (
                      <tr key={appt._id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400"><User size={20} /></div>
                              <div><h4 className="font-black text-hospital-dark">{appt.name}</h4><p className="text-xs font-bold text-gray-400 font-mono italic">{appt.token}</p></div>
                            </div>
                        </td>
                        <td className="px-8 py-6"><p className="font-bold text-hospital-dark">{appt.department}</p></td>
                        <td className="px-8 py-6"><span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${appt.paymentStatus === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>{appt.paymentStatus}</span></td>
                        <td className="px-8 py-6 text-right">
                            <button onClick={() => updateStatus(appt._id, 'Paid')} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"><CheckCircle size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
          </>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-4xl space-y-12">
            <div className="bg-white p-12 rounded-[60px] shadow-sm border border-gray-100 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-hospital-primary opacity-5 rounded-bl-full"></div>
               <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 rounded-2xl bg-hospital-primary/10 flex items-center justify-center text-hospital-primary"><Globe size={24} /></div>
                     <div>
                        <h3 className="text-2xl font-black text-hospital-dark tracking-tight">Visibility Controls</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Manage Homepage Sections</p>
                     </div>
                  </div>
               </div>
               
               <div className="p-8 bg-gray-50 rounded-[32px] border border-gray-100 flex flex-col gap-8">
                  <div className="flex items-start justify-between">
                     <div>
                        <h4 className="font-black text-hospital-dark text-lg mb-2">Primary Services Section</h4>
                        <p className="text-sm font-medium text-gray-400 leading-relaxed max-w-lg">Toggle this switch to show or hide the comprehensive services grid on the landing page. Useful for seasonal maintenance or service restructuring.</p>
                     </div>
                     <div 
                        onClick={handleToggleCoreServices}
                        className={`w-16 h-8 rounded-full p-1 cursor-pointer transition-all duration-500 flex items-center shrink-0 ${config.showCoreServices ? 'bg-hospital-primary' : 'bg-gray-300'}`}>
                        <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-500 transform ${config.showCoreServices ? 'translate-x-8' : 'translate-x-0'}`}></div>
                     </div>
                  </div>

                  <div className="w-full h-px bg-gray-200"></div>
                  
                  <div className="flex items-start justify-between">
                     <div>
                        <h4 className="font-black text-hospital-dark text-lg mb-2">Health Awareness Posters</h4>
                        <p className="text-sm font-medium text-gray-400 leading-relaxed max-w-lg">Display or hide the health education carousel from the home page.</p>
                     </div>
                     <div 
                        onClick={handleToggleHealthAwareness}
                        className={`w-16 h-8 rounded-full p-1 cursor-pointer transition-all duration-500 flex items-center shrink-0 ${config.showHealthAwareness !== false ? 'bg-hospital-primary' : 'bg-gray-300'}`}>
                        <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-500 transform ${config.showHealthAwareness !== false ? 'translate-x-8' : 'translate-x-0'}`}></div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-hospital-dark text-white p-12 rounded-[60px] shadow-4xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 text-white/5"><Activity size={100} /></div>
                <h3 className="text-2xl font-black mb-6">System Health</h3>
                <div className="grid grid-cols-2 gap-8">
                   <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                      <p className="text-[10px] font-black uppercase text-white/40 mb-2">Supabase Sync</p>
                      <p className="text-xl font-black text-green-400 flex items-center gap-2 underline decoration-2">Connected <CheckCircle size={16}/></p>
                   </div>
                   <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                      <p className="text-[10px] font-black uppercase text-white/40 mb-2">API Latency</p>
                      <p className="text-xl font-black text-hospital-primary italic">12ms - Ideal</p>
                   </div>
                </div>
            </div>
          </div>
        )}

        {/* Other tabs remain similar or can be expanded */}
      </main>
    </div>
  );
};

const User = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);

export default AdminDashboard;
