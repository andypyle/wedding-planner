'use client'

import { useEffect, useState } from 'react'
import { TimelineEvent } from '../types/timeline'

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

  const getEventsByTime = (startTime: string, endTime: string) => {
    return events.filter(
      (event) => event.start_time >= startTime && event.start_time <= endTime
    )
  }

  const getEventsByVendor = (vendorName: string) => {
    return events.filter((event) => event.vendor_name === vendorName)
  }

  const getEventsByLocation = (location: string) => {
    return events.filter((event) => event.location === location)
  }

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsByTime,
    getEventsByVendor,
    getEventsByLocation,
  }
}
