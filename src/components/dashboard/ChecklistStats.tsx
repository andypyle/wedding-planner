'use client'

import { ChecklistItem } from '@/types/checklist'

interface ChecklistStatsProps {
  items: ChecklistItem[]
}

export function ChecklistStats({ items }: ChecklistStatsProps) {
  const totalTasks = items.length
  const completedTasks = items.filter((item) => item.completed).length
  const upcomingTasks = totalTasks - completedTasks
  const completionPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Group tasks by category
  const tasksByCategory = items.reduce((acc, item) => {
    const category = item.category || 'Planning'
    if (!acc[category]) {
      acc[category] = {
        total: 0,
        completed: 0,
      }
    }
    acc[category].total++
    if (item.completed) {
      acc[category].completed++
    }
    return acc
  }, {} as Record<string, { total: number; completed: number }>)

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <p className="text-3xl font-semibold text-slate-900">{totalTasks}</p>
          <p className="text-sm text-slate-600">Total Tasks</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-semibold text-slate-900">
            {completedTasks}
          </p>
          <p className="text-sm text-slate-600">Completed</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-semibold text-slate-900">
            {upcomingTasks}
          </p>
          <p className="text-sm text-slate-600">Upcoming</p>
        </div>
      </div>

      <div className="w-full bg-slate-200 rounded-full h-2 mb-6">
        <div
          className="bg-slate-600 h-2 rounded-full"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>

      <div>
        <h3 className="text-sm font-medium text-slate-600 mb-2">By Category</h3>
        {Object.entries(tasksByCategory).map(([category, stats]) => (
          <div
            key={category}
            className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-800">{category}</span>
            <span className="text-sm text-slate-600">
              {stats.completed}/{stats.total}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
