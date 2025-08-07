import { motion } from 'framer-motion'
import { Home, Plus, List, BarChart3 } from 'lucide-react'

const Navigation = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'add', label: 'Add Meal', icon: Plus },
    { id: 'meals', label: 'Meals', icon: List },
    { id: 'statistics', label: 'Statistics', icon: BarChart3 },
  ]

  return (
    <nav className="container mx-auto px-4 py-6">
      <div className="glass rounded-2xl p-2">
        <div className="flex space-x-2">
          {navItems.map((item) => {
            const isActive = currentView === item.id
            return (
              <motion.button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`relative flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  isActive
                    ? 'text-white bg-gradient-to-r from-primary-500 to-primary-600 shadow-lg'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className="relative z-10 flex items-center space-x-2">
                  <item.icon className="w-5 h-5" />
                  <span className="hidden sm:block">{item.label}</span>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default Navigation