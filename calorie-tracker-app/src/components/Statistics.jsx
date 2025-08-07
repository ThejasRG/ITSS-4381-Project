import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts'
import {
  TrendingUp,
  Calendar,
  Target,
  Award,
  Zap,
  Activity,
  BarChart3
} from 'lucide-react'
import { format, subDays, parseISO } from 'date-fns'

const Statistics = ({ meals }) => {
  const stats = useMemo(() => {
    if (!meals.length) return null

    const totalMeals = meals.length
    const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0)
    const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0)
    const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0)
    const totalFats = meals.reduce((sum, meal) => sum + meal.fats, 0)

    const avgCaloriesPerMeal = totalCalories / totalMeals
    const avgProteinPerMeal = totalProtein / totalMeals

    // Daily data for the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), i)
      const dateStr = format(date, 'yyyy-MM-dd')
      const dayMeals = meals.filter(meal => meal.date === dateStr)
      
      return {
        date: format(date, 'MMM dd'),
        calories: dayMeals.reduce((sum, meal) => sum + meal.calories, 0),
        protein: dayMeals.reduce((sum, meal) => sum + meal.protein, 0),
        carbs: dayMeals.reduce((sum, meal) => sum + meal.carbs, 0),
        fats: dayMeals.reduce((sum, meal) => sum + meal.fats, 0),
        meals: dayMeals.length
      }
    }).reverse()

    // Meal type distribution
    const mealTypeData = ['Breakfast', 'Lunch', 'Dinner', 'Snack'].map(type => {
      const typeMeals = meals.filter(meal => meal.mealType === type)
      return {
        name: type,
        value: typeMeals.length,
        calories: typeMeals.reduce((sum, meal) => sum + meal.calories, 0)
      }
    }).filter(item => item.value > 0)

    // Macronutrient breakdown
    const macroData = [
      { name: 'Protein', value: totalProtein * 4, color: '#22c55e' }, // 4 cal per gram
      { name: 'Carbs', value: totalCarbs * 4, color: '#3b82f6' }, // 4 cal per gram
      { name: 'Fats', value: totalFats * 9, color: '#f59e0b' } // 9 cal per gram
    ]

    return {
      totalMeals,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFats,
      avgCaloriesPerMeal,
      avgProteinPerMeal,
      last7Days,
      mealTypeData,
      macroData
    }
  }, [meals])

  if (!stats) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="cyber-card text-center py-12"
      >
        <BarChart3 className="w-16 h-16 text-white/30 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Data Available</h3>
        <p className="text-white/60">Add some meals to see your nutrition statistics.</p>
      </motion.div>
    )
  }

  const COLORS = ['#0ea5e9', '#d946ef', '#22c55e', '#f59e0b']

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="cyber-card"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-accent-500/20 to-accent-600/20 rounded-xl">
            <BarChart3 className="w-8 h-8 text-accent-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Nutrition Analytics</h1>
            <p className="text-white/60">Comprehensive insights into your dietary patterns</p>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Calories',
            value: stats.totalCalories.toFixed(0),
            unit: 'kcal',
            icon: Zap,
            color: 'text-primary-400',
            bg: 'from-primary-500/20 to-primary-600/20'
          },
          {
            title: 'Total Protein',
            value: stats.totalProtein.toFixed(1),
            unit: 'g',
            icon: TrendingUp,
            color: 'text-accent-400',
            bg: 'from-accent-500/20 to-accent-600/20'
          },
          {
            title: 'Avg per Meal',
            value: stats.avgCaloriesPerMeal.toFixed(0),
            unit: 'kcal',
            icon: Target,
            color: 'text-secondary-400',
            bg: 'from-secondary-500/20 to-secondary-600/20'
          },
          {
            title: 'Total Meals',
            value: stats.totalMeals,
            unit: 'meals',
            icon: Award,
            color: 'text-purple-400',
            bg: 'from-purple-500/20 to-purple-600/20'
          }
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="cyber-card"
          >
            <div className={`flex items-center justify-between p-4 rounded-xl bg-gradient-to-br ${metric.bg}`}>
              <div>
                <p className="text-white/60 text-sm font-medium">{metric.title}</p>
                <p className={`text-2xl font-bold ${metric.color}`}>
                  {metric.value}
                  <span className="text-sm ml-1 text-white/50">{metric.unit}</span>
                </p>
              </div>
              <metric.icon className={`w-8 h-8 ${metric.color}`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Calories Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="cyber-card"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <Calendar className="w-5 h-5 text-primary-400 mr-2" />
            Daily Calories (Last 7 Days)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats.last7Days}>
              <defs>
                <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af" 
                fontSize={12}
              />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="calories" 
                stroke="#0ea5e9" 
                fillOpacity={1} 
                fill="url(#colorCalories)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Macronutrient Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="cyber-card"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <Activity className="w-5 h-5 text-accent-400 mr-2" />
            Macronutrient Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.macroData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {stats.macroData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value) => [`${value.toFixed(0)} kcal`, 'Calories']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-6 mt-4">
            {stats.macroData.map((item, index) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-white/70 text-sm">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Meal Type Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="cyber-card"
        >
          <h2 className="text-xl font-bold text-white mb-6">Meal Type Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.mealTypeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="name" 
                stroke="#9ca3af" 
                fontSize={12}
              />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Weekly Protein Trend */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="cyber-card"
        >
          <h2 className="text-xl font-bold text-white mb-6">Daily Protein Intake</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.last7Days}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af" 
                fontSize={12}
              />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value) => [`${value.toFixed(1)}g`, 'Protein']}
              />
              <Line 
                type="monotone" 
                dataKey="protein" 
                stroke="#22c55e" 
                strokeWidth={3}
                dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#22c55e', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Additional Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="cyber-card"
      >
        <h2 className="text-xl font-bold text-white mb-6">Nutrition Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-primary-500/10 rounded-xl">
            <h3 className="font-semibold text-primary-400 mb-2">Calorie Balance</h3>
            <p className="text-white/70 text-sm">
              Average daily intake: <span className="text-white font-medium">
                {(stats.totalCalories / 7).toFixed(0)} kcal
              </span>
            </p>
          </div>
          <div className="p-4 bg-accent-500/10 rounded-xl">
            <h3 className="font-semibold text-accent-400 mb-2">Protein Goal</h3>
            <p className="text-white/70 text-sm">
              Daily average: <span className="text-white font-medium">
                {(stats.totalProtein / 7).toFixed(1)}g protein
              </span>
            </p>
          </div>
          <div className="p-4 bg-secondary-500/10 rounded-xl">
            <h3 className="font-semibold text-secondary-400 mb-2">Meal Frequency</h3>
            <p className="text-white/70 text-sm">
              Average meals per day: <span className="text-white font-medium">
                {(stats.totalMeals / 7).toFixed(1)} meals
              </span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Statistics