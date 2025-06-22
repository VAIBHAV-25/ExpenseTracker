import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AppProvider, useApp } from './context/AppContext';
import { AuthScreen } from './components/Auth/AuthScreen';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { Groups } from './components/Groups';
import { AddExpense } from './components/AddExpense';
import { History } from './components/History';
import { Profile } from './components/Profile';
import { Loader } from 'lucide-react';

function AppContent() {
  const { auth } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (auth.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl"
          >
            <Loader className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-xl font-semibold text-white">Loading SplitSmart...</h2>
          <p className="text-gray-400 mt-2">Setting up your workspace</p>
        </motion.div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return <AuthScreen />;
  }

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'groups':
        return <Groups />;
      case 'add':
        return <AddExpense />;
      case 'history':
        return <History />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="pb-20 md:pb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderActiveComponent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#f9fafb',
            borderRadius: '12px',
            border: '1px solid #374151',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#1f2937',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#1f2937',
            },
          },
        }}
      />
    </AppProvider>
  );
}

export default App;