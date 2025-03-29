'use client'

import { Card, CardBody, CardHeader } from '@/components/Card/Card'
import { ProgressBar } from '@/components/ProgressBar'
import Link from 'next/link'
import { ChecklistStatsProps } from './types'

export function ChecklistStats({ items }: ChecklistStatsProps) {
  console.log('ChecklistStats - items:', items)
  const totalTasks = items.length
  const completedTasks = items.filter((item) => item.completed).length
  const upcomingTasks = totalTasks - completedTasks
  const completionPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  console.log('ChecklistStats - completionPercentage:', completionPercentage)

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
    <Card variant="bordered" theme="slate">
      <CardHeader>
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-slate-800">
            Checklist Overview
          </h2>
          <Link
            href="/checklist"
            className="text-sm text-slate-600 hover:text-slate-900">
            View All Tasks →
          </Link>
        </div>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <p className="text-3xl font-semibold text-slate-900">
              {totalTasks}
            </p>
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

        <ProgressBar
          value={completionPercentage}
          variant="success"
          showLabel={true}
          label={`${completionPercentage}% Complete`}
          className="mb-6"
        />

        <div>
          <h3 className="text-sm font-medium text-slate-600 mb-2">
            By Category
          </h3>
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
      </CardBody>
    </Card>
  )
}
