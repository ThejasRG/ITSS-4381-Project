import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Utensils, Calendar, Clock } from 'lucide-react'

const AddMeal = ({ onAddMeal }) => {
  const [formData, setFormData] = useState({
    foodName: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    date: new Date().toISOString().split('T')[0],
    mealType: 'Breakfast'
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack']

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.foodName.trim()) {
      newErrors.foodName = 'Food name is required'
    }
    
    if (!formData.calories || formData.calories <= 0) {
      newErrors.calories = 'Calories must be greater than 0'
    }
    
    if (!formData.protein || formData.protein < 0) {
      newErrors.protein = 'Protein must be 0 or greater'
    }
    
    if (!formData.carbs || formData.carbs < 0) {
      newErrors.carbs = 'Carbs must be 0 or greater'
    }
    
    if (!formData.fats || formData.fats < 0) {
      newErrors.fats = 'Fats must be 0 or greater'
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    // Simulate API call delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const mealData = {
      ...formData,
      calories: parseFloat(formData.calories),
      protein: parseFloat(formData.protein),
      carbs: parseFloat(formData.carbs),
      fats: parseFloat(formData.fats)
    }
    
    onAddMeal(mealData)
    
    // Reset form
    setFormData({
      foodName: '',
      calories: '',
      protein: '',
      carbs: '',
      fats: '',
      date: new Date().toISOString().split('T')[0],
      mealType: 'Breakfast'
    })
    
    setIsSubmitting(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="cyber-card"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-xl">
            <Utensils className="w-8 h-8 text-primary-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Add New Meal</h1>
            <p className="text-white/60">Log your nutritional intake</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-white/80 mb-2">
                Food Name *
              </label>
              <input
                type="text"
                name="foodName"
                value={formData.foodName}
                onChange={handleChange}
                className={`cyber-input w-full ${errors.foodName ? 'border-red-500' : ''}`}
                placeholder="e.g., Grilled Chicken Breast"
              />
              {errors.foodName && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-1"
                >
                  {errors.foodName}
                </motion.p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Calories *
              </label>
              <input
                type="number"
                name="calories"
                value={formData.calories}
                onChange={handleChange}
                className={`cyber-input w-full ${errors.calories ? 'border-red-500' : ''}`}
                placeholder="250"
                min="0"
                step="0.1"
              />
              {errors.calories && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-1"
                >
                  {errors.calories}
                </motion.p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Protein (g) *
              </label>
              <input
                type="number"
                name="protein"
                value={formData.protein}
                onChange={handleChange}
                className={`cyber-input w-full ${errors.protein ? 'border-red-500' : ''}`}
                placeholder="25"
                min="0"
                step="0.1"
              />
              {errors.protein && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-1"
                >
                  {errors.protein}
                </motion.p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Carbs (g) *
              </label>
              <input
                type="number"
                name="carbs"
                value={formData.carbs}
                onChange={handleChange}
                className={`cyber-input w-full ${errors.carbs ? 'border-red-500' : ''}`}
                placeholder="15"
                min="0"
                step="0.1"
              />
              {errors.carbs && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-1"
                >
                  {errors.carbs}
                </motion.p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Fats (g) *
              </label>
              <input
                type="number"
                name="fats"
                value={formData.fats}
                onChange={handleChange}
                className={`cyber-input w-full ${errors.fats ? 'border-red-500' : ''}`}
                placeholder="10"
                min="0"
                step="0.1"
              />
              {errors.fats && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-1"
                >
                  {errors.fats}
                </motion.p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`cyber-input w-full ${errors.date ? 'border-red-500' : ''}`}
              />
              {errors.date && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-1"
                >
                  {errors.date}
                </motion.p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Meal Type
              </label>
              <select
                name="mealType"
                value={formData.mealType}
                onChange={handleChange}
                className="cyber-input w-full"
              >
                {mealTypes.map(type => (
                  <option key={type} value={type} className="bg-dark-800 text-white">
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            className={`cyber-button w-full flex items-center justify-center space-x-2 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Meal</span>
              </>
            )}
          </motion.button>
        </form>
      </motion.div>

      {/* Nutrition Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 cyber-card"
      >
        <h3 className="text-lg font-semibold text-white mb-4">💡 Nutrition Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white/70">
          <div className="p-3 bg-primary-500/10 rounded-lg">
            <strong className="text-primary-400">Protein:</strong> Aim for 0.8-1g per kg of body weight daily
          </div>
          <div className="p-3 bg-accent-500/10 rounded-lg">
            <strong className="text-accent-400">Carbs:</strong> 45-65% of total daily calories
          </div>
          <div className="p-3 bg-secondary-500/10 rounded-lg">
            <strong className="text-secondary-400">Fats:</strong> 20-35% of total daily calories
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AddMeal