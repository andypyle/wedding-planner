'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface ChecklistStats {
  total: number
  completed: number
  upcoming: number
  categories: {
    [key: string]: {
      total: number
      completed: number
    }
  }
}

export default function DashboardPage() {
  const [checklistStats, setChecklistStats] = useState<ChecklistStats | null>(
    null
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userName, setUserName] = useState<string>('')
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const initializeDashboard = async () => {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        router.push('/login')
        return
      }
      setUserName(userData.user.user_metadata?.full_name || '')
      fetchChecklistStats(userData.user.id)
    }

    initializeDashboard()
  }, [router])

  const fetchChecklistStats = async (userId: string) => {
    try {
      console.log('Fetching checklist stats...')
      const { data, error } = await supabase
        .from('checklist_items')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Fetched data:', data)

      const stats: ChecklistStats = {
        total: data?.length || 0,
        completed: data?.filter((item) => item.completed).length || 0,
        upcoming:
          data?.filter(
            (item) =>
              !item.completed &&
              item.due_date &&
              new Date(item.due_date) > new Date()
          ).length || 0,
        categories: {},
      }

      // Calculate stats by category
      data?.forEach((item) => {
        if (!stats.categories[item.category]) {
          stats.categories[item.category] = {
            total: 0,
            completed: 0,
          }
        }
        stats.categories[item.category].total++
        if (item.completed) {
          stats.categories[item.category].completed++
        }
      })

      console.log('Calculated stats:', stats)
      setChecklistStats(stats)
    } catch (err) {
      console.error('Error fetching checklist stats:', err)
      setError('Failed to load checklist stats')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-earth-800">Dashboard</h1>
        <p className="mt-1 text-sm text-earth-600">
          Welcome back, {userName || 'there'}!
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Checklist Stats Card */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-earth-800">
              Checklist Progress
            </h2>
            <a
              href="/checklist"
              className="text-primary hover:text-primary-dark text-sm">
              View All
            </a>
          </div>
          {checklistStats ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-earth-600">Total Tasks</span>
                <span className="font-medium text-earth-800">
                  {checklistStats.total}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-earth-600">Completed</span>
                <span className="font-medium text-earth-800">
                  {checklistStats.completed}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-earth-600">Upcoming</span>
                <span className="font-medium text-earth-800">
                  {checklistStats.upcoming}
                </span>
              </div>
              <div className="pt-4 border-t border-earth-200">
                <h3 className="text-sm font-medium text-earth-700 mb-2">
                  By Category
                </h3>
                <div className="space-y-2">
                  {Object.entries(checklistStats.categories).map(
                    ([category, stats]) => (
                      <div
                        key={category}
                        className="flex items-center justify-between">
                        <span className="text-sm text-earth-600">
                          {category}
                        </span>
                        <span className="text-sm font-medium text-earth-800">
                          {stats.completed}/{stats.total}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-earth-600">No checklist items yet</p>
              <a
                href="/checklist"
                className="mt-2 text-primary hover:text-primary-dark text-sm">
                Add your first item
              </a>
            </div>
          )}
        </div>

        {/* Add more dashboard cards here */}
      </div>
    </div>
  )
}
