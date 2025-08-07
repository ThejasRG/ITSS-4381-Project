import { motion } from 'framer-motion'
import { Activity, Zap } from 'lucide-react'

const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass border-b border-white/10 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-accent-500 rounded-full flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Zap className="w-2 h-2 text-white" />
              </motion.div>
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">NutriTracker</h1>
              <p className="text-xs text-white/60">Futuristic Nutrition</p>
            </div>
          </motion.div>

          <div className="flex items-center space-x-4">
            <motion.div
              className="hidden md:block"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="flex items-center space-x-2 text-sm text-white/60">
                <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></div>
                <span>System Online</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header