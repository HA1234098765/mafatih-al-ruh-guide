import { Moon, Sun, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useTheme } from "./ThemeProvider"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <motion.div
      whileHover={{ scale: 1.08, rotate: 2 }}
      whileTap={{ scale: 0.92, rotate: -2 }}
      className="relative"
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="relative h-12 w-12 rounded-2xl glass-effect border-2 border-black/10 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group perspective-1000"
      >
        {/* Enhanced background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/20 dark:via-blue-400/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
        
        {/* Animated background glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          animate={{
            boxShadow: theme === 'dark' 
              ? [
                  "0 0 20px rgba(59, 130, 246, 0.2)",
                  "0 0 40px rgba(59, 130, 246, 0.3)",
                  "0 0 20px rgba(59, 130, 246, 0.2)"
                ]
              : [
                  "0 0 20px rgba(251, 191, 36, 0.2)",
                  "0 0 40px rgba(251, 191, 36, 0.3)",
                  "0 0 20px rgba(251, 191, 36, 0.2)"
                ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Sun icon with enhanced animations */}
        <motion.div
          initial={false}
          animate={{
            rotate: theme === 'dark' ? 180 : 0,
            scale: theme === 'dark' ? 0 : 1,
            opacity: theme === 'dark' ? 0 : 1,
            rotateY: theme === 'dark' ? 90 : 0
          }}
          transition={{ 
            duration: 0.6, 
            ease: "easeInOut",
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
          className="absolute inset-0 flex items-center justify-center z-10"
        >
          <div className="relative">
            <Sun className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />
            
            {/* Sun rays animation */}
            {theme === 'light' && (
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-0.5 h-2 bg-yellow-400 rounded-full"
                    style={{
                      top: -8,
                      left: '50%',
                      transformOrigin: '50% 16px',
                      transform: `translateX(-50%) rotate(${i * 45}deg)`
                    }}
                    animate={{
                      opacity: [0.5, 1, 0.5],
                      scale: [0.8, 1, 0.8]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Moon icon with enhanced animations */}
        <motion.div
          initial={false}
          animate={{
            rotate: theme === 'dark' ? 0 : -180,
            scale: theme === 'dark' ? 1 : 0,
            opacity: theme === 'dark' ? 1 : 0,
            rotateY: theme === 'dark' ? 0 : -90
          }}
          transition={{ 
            duration: 0.6, 
            ease: "easeInOut",
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
          className="absolute inset-0 flex items-center justify-center z-10"
        >
          <div className="relative">
            <Moon className="h-6 w-6 text-blue-400 dark:text-blue-300" />
            
            {/* Stars animation around moon */}
            {theme === 'dark' && (
              <div className="absolute inset-0">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      top: `${20 + Math.cos(i * 60 * Math.PI / 180) * 20}px`,
                      left: `${20 + Math.sin(i * 60 * Math.PI / 180) * 20}px`
                    }}
                    animate={{
                      opacity: [0.3, 1, 0.3],
                      scale: [0.5, 1, 0.5],
                      rotate: [0, 180, 360]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "easeInOut"
                    }}
                  >
                    <Sparkles className="h-1.5 w-1.5 text-blue-200" />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Transition particles */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 0.6,
            ease: "easeInOut"
          }}
        >
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 rounded-full ${
                theme === 'dark' ? 'bg-blue-400' : 'bg-yellow-400'
              }`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, Math.random() * 10 - 5, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 1,
                delay: i * 0.05,
                ease: "easeOut"
              }}
            />
          ))}
        </motion.div>

        <span className="sr-only">تبديل الثيم</span>
      </Button>
      
      {/* Floating tooltip */}
      <motion.div
        className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20"
        initial={{ y: 10, opacity: 0 }}
        whileHover={{ y: 0, opacity: 1 }}
      >
        {theme === 'light' ? 'التبديل للوضع المظلم' : 'التبديل للوضع الفاتح'}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 border-4 border-transparent border-b-black dark:border-b-white"></div>
      </motion.div>
    </motion.div>
  )
}
