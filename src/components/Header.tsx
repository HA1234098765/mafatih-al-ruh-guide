
import React from 'react';
import { Moon, Sun, Key, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDark, toggleTheme }) => {
  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 right-0 left-0 z-50 glass-effect backdrop-blur-xl border-b border-black/10 dark:border-white/10 shadow-lg"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-black/5 dark:bg-white/5 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-black/3 dark:bg-white/3 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="container mx-auto px-6 py-4 relative z-10">
        <div className="flex items-center justify-between">
          {/* Enhanced Brand Section */}
          <motion.div 
            className="flex items-center space-x-reverse space-x-4"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Animated Logo */}
            <motion.div 
              className="relative w-12 h-12 bg-gradient-to-br from-black via-gray-800 to-gray-600 dark:from-white dark:via-gray-200 dark:to-gray-300 rounded-2xl flex items-center justify-center shadow-xl border border-black/10 dark:border-white/10 overflow-hidden group"
              whileHover={{ 
                scale: 1.1, 
                rotate: 5,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.9 }}
            >
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-black/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <Key className="w-7 h-7 text-white dark:text-black relative z-10" />
              
              {/* Sparkle effects */}
              <div className="absolute top-1 right-1 w-2 h-2 bg-white dark:bg-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ animationDelay: '0.1s' }}></div>
              <div className="absolute bottom-1 left-1 w-1 h-1 bg-white dark:bg-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ animationDelay: '0.3s' }}></div>
            </motion.div>
            
            {/* Brand Text */}
            <div className="relative">
              <motion.h1 
                className="text-2xl font-bold bg-gradient-to-r from-black via-gray-700 to-black dark:from-white dark:via-gray-300 dark:to-white bg-clip-text text-transparent font-cairo"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                مفاتيح
              </motion.h1>
              <motion.p 
                className="text-xs text-gray-600 dark:text-gray-400 font-medium"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                مساعد المسلم الذكي
              </motion.p>
              
              {/* Decorative underline */}
              <motion.div 
                className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-black to-transparent dark:from-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '70%' }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </div>
          </motion.div>
          
          {/* Enhanced Theme Toggle Button */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.button
              onClick={toggleTheme}
              className="relative p-3 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border-2 border-black/10 dark:border-white/10 shadow-lg overflow-hidden group"
              aria-label="تبديل الوضع"
              whileHover={{ 
                scale: 1.05,
                rotate: 5,
                transition: { duration: 0.2 }
              }}
              whileTap={{ 
                scale: 0.95,
                rotate: -5
              }}
            >
              {/* Background animation on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              
              {/* Icon container with rotation animation */}
              <motion.div
                animate={{ 
                  rotate: isDark ? 360 : 0
                }}
                transition={{ 
                  duration: 0.5,
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
                className="relative z-10"
              >
                {isDark ? (
                  <Sun className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                ) : (
                  <Moon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                )}
              </motion.div>
              
              {/* Sparkle effect for theme toggle */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl">
                <div className="absolute top-1 right-1 w-1 h-1 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ animationDelay: '0.1s' }}></div>
                <div className="absolute bottom-1 left-1 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ animationDelay: '0.3s' }}></div>
              </div>
              
              {/* Subtle shadow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-400 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
