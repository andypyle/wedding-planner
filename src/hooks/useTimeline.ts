'use client'

import { useEffect, useState } from 'react'
import { TimelineEvent, TimelineStatus } from '../types/timeline'

const STORAGE_KEY = 'wedding-timeline'

export function useTimeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([])

  useEffect(() => {
    const savedEvents = localStorage.getItem(STORAGE_KEY)
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
  }, [events])

  const addEvent = (eventData: Omit<TimelineEvent, 'id'>) => {
    const newEvent: TimelineEvent = {
      ...eventData,
      id: Math.random().toString(36).substr(2, 9),
    }
    setEvents((prev) => [...prev, newEvent])
  }

  const updateEvent = (id: string, eventData: Omit<TimelineEvent, 'id'>) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === id ? { ...eventData, id } : event))
    )
  }

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id))
  }

  const updateStatus = (id: string, status: TimelineStatus) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === id
          ? {
              ...event,
              status,
              completedDate:
                status === 'Completed' ? new Date().toISOString() : undefined,
            }
          : event
      )
    )
  }

  const getEventsByStatus = (status: TimelineStatus) => {
    return events.filter((event) => event.status === status)
  }

  const getUpcomingEvents = (days: number = 30) => {
    const now = new Date()
    const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
    return events.filter((event) => {
      const dueDate = new Date(event.dueDate)
      return dueDate >= now && dueDate <= future && event.status !== 'Completed'
    })
  }

  const getOverdueEvents = () => {
    const now = new Date()
    return events.filter((event) => {
      const dueDate = new Date(event.dueDate)
      return dueDate < now && event.status !== 'Completed'
    })
  }

  const getDependentEvents = (id: string) => {
    return events.filter((event) => event.dependencies?.includes(id))
  }

  const canComplete = (id: string) => {
    const event = events.find((e) => e.id === id)
    if (!event?.dependencies?.length) return true
    return event.dependencies.every((depId) =>
      events.find((e) => e.id === depId && e.status === 'Completed')
    )
  }

  const getProgress = () => {
    if (events.length === 0) return 0
    const completed = events.filter(
      (event) => event.status === 'Completed'
    ).length
    return Math.round((completed / events.length) * 100)
  }

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    updateStatus,
    getEventsByStatus,
    getUpcomingEvents,
    getOverdueEvents,
    getDependentEvents,
    canComplete,
    getProgress,
  }
}
