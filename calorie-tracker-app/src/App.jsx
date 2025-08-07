import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  BarChart3, 
  List, 
  Zap, 
  Calendar,
  TrendingUp,
  Database,
  Sparkles
} from 'lucide-react'
import AddMeal from './components/AddMeal'
import MealList from './components/MealList'
import Statistics from './components/Statistics'
import Header from './components/Header'
import Navigation from './components/Navigation'

function App() {
  const [meals, setMeals] = useState([])
  const [currentView, setCurrentView] = useState('dashboard')
  const [isLoading, setIsLoading] = useState(true)

  // Load meals from localStorage on component mount
  useEffect(() => {
    const savedMeals = localStorage.getItem('calorie-tracker-meals')
    if (savedMeals) {
      try {
        setMeals(JSON.parse(savedMeals))
      } catch (error) {
        console.error('Error loading meals:', error)
      }
    }
    setTimeout(() => setIsLoading(false), 1000) // Simulate loading for smooth animation
  }, [])

  // Save meals to localStorage whenever meals change
  useEffect(() => {
    if (meals.length > 0) {
      localStorage.setItem('calorie-tracker-meals', JSON.stringify(meals))
    }
  }, [meals])

  const addMeal = (meal) => {
    const newMeal = {
      ...meal,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    }
    setMeals(prev => [newMeal, ...prev])
  }

  const updateMeal = (id, updatedMeal) => {
    setMeals(prev => prev.map(meal => 
      meal.id === id ? { ...meal, ...updatedMeal } : meal
    ))
  }

  const deleteMeal = (id) => {
    setMeals(prev => prev.filter(meal => meal.id !== id))
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'add':
        return <AddMeal onAddMeal={addMeal} />
      case 'meals':
        return <MealList meals={meals} onUpdateMeal={updateMeal} onDeleteMeal={deleteMeal} />
      case 'statistics':
        return <Statistics meals={meals} />
      default:
        return <Dashboard meals={meals} onViewChange={setCurrentView} />
    }
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-accent-500/10 rounded-full blur-3xl animate-float"></div>
      </div>

      <div className="relative z-10">
        <Header />
        <Navigation currentView={currentView} onViewChange={setCurrentView} />
        
        <main className="container mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderCurrentView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

// Dashboard component
const Dashboard = ({ meals, onViewChange }) => {
  const totalMeals = meals.length
  const todayMeals = meals.filter(meal => {
    const today = new Date().toDateString()
    const mealDate = new Date(meal.date).toDateString()
    return today === mealDate
  })

  const totalCaloriesToday = todayMeals.reduce((sum, meal) => sum + meal.calories, 0)
  const totalProteinToday = todayMeals.reduce((sum, meal) => sum + meal.protein, 0)

  const stats = [
    {
      title: 'Today\'s Calories',
      value: totalCaloriesToday,
      unit: 'kcal',
      icon: Zap,
      color: 'text-primary-400',
      bg: 'from-primary-500/20 to-primary-600/20'
    },
    {
      title: 'Today\'s Protein',
      value: totalProteinToday.toFixed(1),
      unit: 'g',
      icon: TrendingUp,
      color: 'text-accent-400',
      bg: 'from-accent-500/20 to-accent-600/20'
    },
    {
      title: 'Total Meals',
      value: totalMeals,
      unit: 'meals',
      icon: Database,
      color: 'text-secondary-400',
      bg: 'from-secondary-500/20 to-secondary-600/20'
    },
    {
      title: 'Today\'s Meals',
      value: todayMeals.length,
      unit: 'meals',
      icon: Calendar,
      color: 'text-purple-400',
      bg: 'from-purple-500/20 to-purple-600/20'
    }
  ]

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
          Calorie Tracker
        </h1>
        <p className="text-xl text-white/70 mb-8">
          Track your nutrition with futuristic precision
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="cyber-card"
          >
            <div className={`flex items-center justify-between p-4 rounded-xl bg-gradient-to-br ${stat.bg}`}>
              <div>
                <p className="text-white/60 text-sm font-medium">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                  <span className="text-sm ml-1 text-white/50">{stat.unit}</span>
                </p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.button
          onClick={() => onViewChange('add')}
          className="cyber-card group cursor-pointer text-left"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-xl">
              <Plus className="w-8 h-8 text-primary-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Add Meal</h3>
              <p className="text-white/60">Log your nutrition intake</p>
            </div>
          </div>
        </motion.button>

        <motion.button
          onClick={() => onViewChange('meals')}
          className="cyber-card group cursor-pointer text-left"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-secondary-500/20 to-secondary-600/20 rounded-xl">
              <List className="w-8 h-8 text-secondary-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">View Meals</h3>
              <p className="text-white/60">Browse your meal history</p>
            </div>
          </div>
        </motion.button>

        <motion.button
          onClick={() => onViewChange('statistics')}
          className="cyber-card group cursor-pointer text-left"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-accent-500/20 to-accent-600/20 rounded-xl">
              <BarChart3 className="w-8 h-8 text-accent-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Statistics</h3>
              <p className="text-white/60">Analyze your nutrition data</p>
            </div>
          </div>
        </motion.button>
      </div>

      {todayMeals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="cyber-card"
        >
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <Sparkles className="w-6 h-6 text-primary-400 mr-2" />
            Today's Meals
          </h2>
          <div className="space-y-3">
            {todayMeals.slice(0, 3).map((meal) => (
              <div key={meal.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">{meal.foodName}</p>
                  <p className="text-white/60 text-sm">{meal.mealType}</p>
                </div>
                <div className="text-right">
                  <p className="text-primary-400 font-bold">{meal.calories} kcal</p>
                  <p className="text-white/60 text-sm">{meal.protein}g protein</p>
                </div>
              </div>
            ))}
            {todayMeals.length > 3 && (
              <button
                onClick={() => onViewChange('meals')}
                className="w-full text-center text-primary-400 hover:text-primary-300 transition-colors py-2"
              >
                View all {todayMeals.length} meals →
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}

// Loading screen component
const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full mx-auto mb-4"
      />
      <h2 className="text-2xl font-bold gradient-text">Loading Calorie Tracker</h2>
      <p className="text-white/60 mt-2">Initializing futuristic nutrition system...</p>
    </motion.div>
  </div>
)

export default App
