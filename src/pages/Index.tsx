import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import IslamicQA from '@/components/IslamicQA';
import { UserProfile } from '@/components/UserProfile';
import { SpiritualContent } from '@/components/SpiritualContent';
import DreamInterpretation from '@/components/DreamInterpretation';
import { NotificationSystem } from '@/components/NotificationSystem';

const Index = () => {
  const [activeSection, setActiveSection] = useState('qa');
  const [selectedMood, setSelectedMood] = useState<string>('');

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    // Auto-navigate to Islamic Q&A section
    setTimeout(() => {
      setActiveSection('qa');
    }, 1000);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'qa':
        return <IslamicQA />;
      case 'dreams':
        return <DreamInterpretation />;
      case 'content':
        return <SpiritualContent />;
      case 'notifications':
        return <NotificationSystem />;
      case 'profile':
        return <UserProfile />;
      default:
        return <IslamicQA />;
    }
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="mafatih-ui-theme">
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white dark:from-black dark:via-gray-900 dark:to-black text-black dark:text-white transition-all duration-500">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-black/5 dark:bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-black/3 dark:bg-white/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Enhanced Header with Glass Effect */}
        <header className="fixed top-0 left-0 right-0 z-50 glass-effect backdrop-blur-xl border-b border-black/20 dark:border-white/20">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center">
                  <span className="text-white dark:text-black font-bold text-lg">م</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    مفاتيح
                  </h1>
                  <p className="text-xs text-gray-600 dark:text-gray-400">مساعد المسلم الذكي</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <ThemeToggle />
              </motion.div>
            </div>
          </div>
        </header>

        {/* Enhanced Main Content */}
        <main className="pt-24 pb-24 px-4 relative">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              {renderActiveSection()}
            </motion.div>
          </div>
        </main>

        {/* Enhanced Navigation */}
        <Navigation
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      </div>
    </ThemeProvider>
  );
};

export default Index;
