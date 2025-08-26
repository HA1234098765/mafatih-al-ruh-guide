
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircleQuestion, User, Heart, Bell, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeSection, onSectionChange }) => {
  const sections = [
    { id: 'qa', label: 'سؤال شرعي', icon: MessageCircleQuestion },
    { id: 'dreams', label: 'تفسير الأحلام', icon: Moon },
    { id: 'content', label: 'محتوى روحاني', icon: Heart },
    { id: 'notifications', label: 'الإشعارات', icon: Bell },
    { id: 'profile', label: 'الملف الشخصي', icon: User }
  ];

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed bottom-0 left-0 right-0 z-50"
    >
      <div className="glass-effect backdrop-blur-xl border-t border-black/20 dark:border-white/20 p-4 shadow-2xl relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-br from-black/5 dark:from-white/5 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-0 right-1/4 w-32 h-32 bg-gradient-to-bl from-black/5 dark:from-white/5 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="flex justify-center gap-3 overflow-x-auto scrollbar-hide px-2">
            {sections.map((section, index) => {
              const IconComponent = section.icon;
              const isActive = activeSection === section.id;

              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20, rotateX: -10 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }}
                  whileHover={{ 
                    scale: 1.08, 
                    y: -5,
                    rotateX: 5
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="perspective-1000"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSectionChange(section.id)}
                    className={`
                      relative flex flex-col items-center py-4 px-4 h-auto min-w-[80px] text-xs rounded-2xl
                      transition-all duration-500 group overflow-hidden
                      ${isActive
                        ? 'bg-gradient-to-br from-black to-gray-800 dark:from-white dark:to-gray-200 shadow-xl transform rotate-y-2'
                        : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-lg hover:transform hover:rotate-y-1 hover:scale-105'
                      }
                    `}
                  >
                    {/* Enhanced active indicator with animation */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-br from-black to-gray-800 dark:from-white dark:to-gray-200 rounded-2xl"
                        transition={{ 
                          type: "spring", 
                          bounce: 0.2, 
                          duration: 0.8,
                          stiffness: 300,
                          damping: 20
                        }}
                      >
                        {/* Subtle glow effect */}
                        <motion.div 
                          className="absolute inset-0 rounded-2xl border border-black/20 dark:border-white/20"
                          animate={{ 
                            boxShadow: [
                              "0 0 0 0 rgba(0,0,0,0)",
                              "0 0 0 8px rgba(0,0,0,0)",
                              "0 0 0 0 rgba(0,0,0,0)"
                            ]
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      </motion.div>
                    )}

                    {/* Icon with enhanced styling */}
                    <div className={`relative z-10 p-2 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-white/20 dark:bg-black/20 text-white dark:text-black transform scale-110 shadow-md'
                        : 'group-hover:bg-black/10 dark:group-hover:bg-white/10 group-hover:shadow-md group-hover:transform group-hover:scale-110'
                    }`}>
                      <motion.div
                        whileHover={{ rotate: 10 }}
                        whileTap={{ rotate: -10 }}
                      >
                        <IconComponent className="w-6 h-6" />
                      </motion.div>
                    </div>

                    {/* Label with better typography */}
                    <span className={`relative z-10 text-[11px] leading-tight text-center mt-2 font-medium transition-all duration-300 ${
                      isActive
                        ? 'text-white dark:text-black font-bold transform scale-105'
                        : 'group-hover:text-black dark:group-hover:text-white group-hover:font-bold group-hover:transform group-hover:scale-105'
                    }`}>
                      {section.label}
                    </span>

                    {/* Enhanced hover effect */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent dark:from-white/10 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl" />
                    )}
                    
                    {/* Ripple effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Navigation;
