import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Calendar,
  Clock,
  Zap,
  TrendingUp,
  Activity,
  X
} from 'lucide-react'
import { format } from 'date-fns'

const MealList = ({ meals, onUpdateMeal, onDeleteMeal }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterDate, setFilterDate] = useState('')
  const [editingMeal, setEditingMeal] = useState(null)
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')

  const mealTypes = ['all', 'Breakfast', 'Lunch', 'Dinner', 'Snack']

  const filteredAndSortedMeals = useMemo(() => {
    let filtered = meals.filter(meal => {
      const matchesSearch = meal.foodName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === 'all' || meal.mealType === filterType
      const matchesDate = !filterDate || meal.date === filterDate
      
      return matchesSearch && matchesType && matchesDate
    })

    // Sort meals
    filtered.sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date)
          bValue = new Date(b.date)
          break
        case 'calories':
          aValue = a.calories
          bValue = b.calories
          break
        case 'protein':
          aValue = a.protein
          bValue = b.protein
          break
        case 'name':
          aValue = a.foodName.toLowerCase()
          bValue = b.foodName.toLowerCase()
          break
        default:
          return 0
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [meals, searchTerm, filterType, filterDate, sortBy, sortOrder])

  const handleEdit = (meal) => {
    setEditingMeal({ ...meal })
  }

  const handleSaveEdit = () => {
    onUpdateMeal(editingMeal.id, editingMeal)
    setEditingMeal(null)
  }

  const handleCancelEdit = () => {
    setEditingMeal(null)
  }

  const handleDelete = (id) => {
    onDeleteMeal(id)
  }

  const getMealTypeColor = (type) => {
    switch (type) {
      case 'Breakfast': return 'text-yellow-400 bg-yellow-500/20'
      case 'Lunch': return 'text-green-400 bg-green-500/20'
      case 'Dinner': return 'text-blue-400 bg-blue-500/20'
      case 'Snack': return 'text-purple-400 bg-purple-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="cyber-card"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-secondary-500/20 to-secondary-600/20 rounded-xl">
            <Activity className="w-8 h-8 text-secondary-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Meal History</h1>
            <p className="text-white/60">{filteredAndSortedMeals.length} meals found</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              placeholder="Search meals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="cyber-input w-full pl-10"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="cyber-input"
          >
            {mealTypes.map(type => (
              <option key={type} value={type} className="bg-dark-800 text-white">
                {type === 'all' ? 'All Types' : type}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="cyber-input"
          />

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split('-')
              setSortBy(newSortBy)
              setSortOrder(newSortOrder)
            }}
            className="cyber-input"
          >
            <option value="date-desc" className="bg-dark-800 text-white">Newest First</option>
            <option value="date-asc" className="bg-dark-800 text-white">Oldest First</option>
            <option value="calories-desc" className="bg-dark-800 text-white">Highest Calories</option>
            <option value="calories-asc" className="bg-dark-800 text-white">Lowest Calories</option>
            <option value="protein-desc" className="bg-dark-800 text-white">Highest Protein</option>
            <option value="name-asc" className="bg-dark-800 text-white">Name A-Z</option>
          </select>
        </div>
      </motion.div>

      {/* Meals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {filteredAndSortedMeals.map((meal, index) => (
            <motion.div
              key={meal.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              className="cyber-card group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">{meal.foodName}</h3>
                  <div className="flex items-center space-x-4 text-sm text-white/60">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{format(new Date(meal.date), 'MMM dd, yyyy')}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getMealTypeColor(meal.mealType)}`}>
                      {meal.mealType}
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.button
                    onClick={() => handleEdit(meal)}
                    className="p-2 bg-primary-500/20 hover:bg-primary-500/30 rounded-lg text-primary-400 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    onClick={() => handleDelete(meal.id)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-primary-500/10 rounded-lg">
                  <Zap className="w-5 h-5 text-primary-400 mx-auto mb-1" />
                  <p className="text-primary-400 font-bold text-lg">{meal.calories}</p>
                  <p className="text-white/60 text-xs">kcal</p>
                </div>
                <div className="text-center p-3 bg-accent-500/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-accent-400 mx-auto mb-1" />
                  <p className="text-accent-400 font-bold text-lg">{meal.protein}</p>
                  <p className="text-white/60 text-xs">protein</p>
                </div>
                <div className="text-center p-3 bg-secondary-500/10 rounded-lg">
                  <Activity className="w-5 h-5 text-secondary-400 mx-auto mb-1" />
                  <p className="text-secondary-400 font-bold text-lg">{meal.carbs}</p>
                  <p className="text-white/60 text-xs">carbs</p>
                </div>
                <div className="text-center p-3 bg-yellow-500/10 rounded-lg">
                  <div className="w-5 h-5 bg-yellow-400 rounded-full mx-auto mb-1"></div>
                  <p className="text-yellow-400 font-bold text-lg">{meal.fats}</p>
                  <p className="text-white/60 text-xs">fats</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredAndSortedMeals.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="cyber-card text-center py-12"
        >
          <Filter className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No meals found</h3>
          <p className="text-white/60">Try adjusting your filters or add some meals to get started.</p>
        </motion.div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {editingMeal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={handleCancelEdit}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="cyber-card max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Edit Meal</h2>
                <button
                  onClick={handleCancelEdit}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Food Name</label>
                  <input
                    type="text"
                    value={editingMeal.foodName}
                    onChange={(e) => setEditingMeal(prev => ({ ...prev, foodName: e.target.value }))}
                    className="cyber-input w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Calories</label>
                    <input
                      type="number"
                      value={editingMeal.calories}
                      onChange={(e) => setEditingMeal(prev => ({ ...prev, calories: parseFloat(e.target.value) || 0 }))}
                      className="cyber-input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Protein (g)</label>
                    <input
                      type="number"
                      value={editingMeal.protein}
                      onChange={(e) => setEditingMeal(prev => ({ ...prev, protein: parseFloat(e.target.value) || 0 }))}
                      className="cyber-input w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Carbs (g)</label>
                    <input
                      type="number"
                      value={editingMeal.carbs}
                      onChange={(e) => setEditingMeal(prev => ({ ...prev, carbs: parseFloat(e.target.value) || 0 }))}
                      className="cyber-input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Fats (g)</label>
                    <input
                      type="number"
                      value={editingMeal.fats}
                      onChange={(e) => setEditingMeal(prev => ({ ...prev, fats: parseFloat(e.target.value) || 0 }))}
                      className="cyber-input w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Date</label>
                    <input
                      type="date"
                      value={editingMeal.date}
                      onChange={(e) => setEditingMeal(prev => ({ ...prev, date: e.target.value }))}
                      className="cyber-input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Meal Type</label>
                    <select
                      value={editingMeal.mealType}
                      onChange={(e) => setEditingMeal(prev => ({ ...prev, mealType: e.target.value }))}
                      className="cyber-input w-full"
                    >
                      {mealTypes.slice(1).map(type => (
                        <option key={type} value={type} className="bg-dark-800 text-white">
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={handleSaveEdit}
                  className="cyber-button flex-1"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold text-white transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MealList