import { createClient } from '@/lib/supabase/client'
import { ChecklistItem } from '@/types/checklist'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function useChecklist() {
  const [items, setItems] = useState<ChecklistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data } = await supabase.auth.getUser()
    if (!data.user) {
      router.push('/login')
      return
    }
    fetchItems()
  }

  const fetchItems = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) return

      const { data, error } = await supabase
        .from('checklist_items')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setItems(data || [])
    } catch (err) {
      console.error('Error fetching checklist items:', err)
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }

  const createItem = async (
    formData: Omit<ChecklistItem, 'id' | 'user_id' | 'created_at'>
  ) => {
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        router.push('/login')
        return
      }

      const { error } = await supabase.from('checklist_items').insert([
        {
          ...formData,
          user_id: userData.user.id,
        },
      ])

      if (error) throw error
      router.refresh()
      fetchItems()
    } catch (err) {
      console.error('Error creating checklist item:', err)
      setError(err as Error)
      throw err
    }
  }

  const updateItem = async (id: string, formData: Partial<ChecklistItem>) => {
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        router.push('/login')
        return
      }

      const { error } = await supabase
        .from('checklist_items')
        .update(formData)
        .eq('id', id)
        .eq('user_id', userData.user.id)

      if (error) throw error
      router.refresh()
      fetchItems()
    } catch (err) {
      console.error('Error updating checklist item:', err)
      setError(err as Error)
      throw err
    }
  }

  const deleteItem = async (id: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        router.push('/login')
        return
      }

      const { error } = await supabase
        .from('checklist_items')
        .delete()
        .eq('id', id)
        .eq('user_id', userData.user.id)

      if (error) throw error
      router.refresh()
      fetchItems()
    } catch (err) {
      console.error('Error deleting checklist item:', err)
      setError(err as Error)
      throw err
    }
  }

  return {
    items,
    isLoading,
    error,
    createItem,
    updateItem,
    deleteItem,
  }
}
