'use client'

import { Modal } from '@/components/Modal'
import { createClient } from '@/lib/supabase/client'
import { ChecklistCategory, ChecklistItem } from '@/types/checklist'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ChecklistPage() {
  const [items, setItems] = useState<ChecklistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [operationType, setOperationType] = useState<
    'create' | 'update' | 'delete' | null
  >(null)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Planning' as ChecklistCategory,
    due_date: '',
    notes: '',
  })
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.push('/login')
        return
      }
      fetchItems()
    }

    checkUser()
  }, [router])

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
      setError('Failed to load checklist items')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item: ChecklistItem) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      description: item.description || '',
      category: item.category as ChecklistCategory,
      due_date: item.due_date || '',
      notes: item.notes || '',
    })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        router.push('/login')
        return
      }

      if (editingItem) {
        setOperationType('update')
        const { error: updateError } = await supabase
          .from('checklist_items')
          .update({
            ...formData,
            due_date: formData.due_date || null,
          })
          .eq('id', editingItem.id)
          .eq('user_id', userData.user.id)

        if (updateError) throw updateError
      } else {
        setOperationType('create')
        const { error: insertError } = await supabase
          .from('checklist_items')
          .insert([
            {
              ...formData,
              due_date: formData.due_date || null,
              user_id: userData.user.id,
            },
          ])

        if (insertError) throw insertError
      }

      setSuccess(true)
      setShowForm(false)
      setEditingItem(null)
      setFormData({
        title: '',
        description: '',
        category: 'Planning',
        due_date: '',
        notes: '',
      })
      router.refresh()
      fetchItems()
    } catch (err) {
      console.error('Error saving checklist item:', err)
      setError(editingItem ? 'Failed to update item' : 'Failed to create item')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    setLoading(true)
    setError(null)
    setSuccess(false)
    setOperationType('delete')

    try {
      const { error: deleteError } = await supabase
        .from('checklist_items')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      setSuccess(true)
      router.refresh()
      fetchItems()
    } catch (err) {
      console.error('Error deleting checklist item:', err)
      setError('Failed to delete item')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleComplete = async (item: ChecklistItem) => {
    setLoading(true)
    setError(null)

    try {
      const { error: updateError } = await supabase
        .from('checklist_items')
        .update({
          completed: !item.completed,
          completed_at: !item.completed ? new Date().toISOString() : null,
        })
        .eq('id', item.id)

      if (updateError) throw updateError

      router.refresh()
      fetchItems()
    } catch (err) {
      console.error('Error updating checklist item:', err)
      setError('Failed to update item')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingItem(null)
    setFormData({
      title: '',
      description: '',
      category: 'Planning',
      due_date: '',
      notes: '',
    })
    setOperationType(null)
  }

  const categories: ChecklistCategory[] = [
    'Planning',
    'Venue',
    'Vendors',
    'Attire',
    'Decor',
    'Food & Drink',
    'Entertainment',
    'Transportation',
    'Guest List',
    'Budget',
    'Other',
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-earth-800">
            Wedding Checklist
          </h1>
          <p className="mt-1 text-sm text-earth-600">
            Keep track of all your wedding planning tasks
          </p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null)
            setFormData({
              title: '',
              description: '',
              category: 'Planning',
              due_date: '',
              notes: '',
            })
            setShowForm(true)
          }}
          className="btn-primary">
          Add Item
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {operationType === 'update'
            ? 'Item updated successfully!'
            : operationType === 'create'
            ? 'Item created successfully!'
            : 'Item deleted successfully!'}
        </div>
      )}

      <Modal
        isOpen={showForm}
        onClose={handleCancel}
        title={editingItem ? 'Edit Item' : 'Add Item'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-earth-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-earth-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-earth-700">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="mt-1 block w-full rounded-md border-earth-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-earth-700">
              Category
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as ChecklistCategory,
                })
              }
              className="mt-1 block w-full rounded-md border-earth-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm">
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="due_date"
              className="block text-sm font-medium text-earth-700">
              Due Date
            </label>
            <input
              type="date"
              id="due_date"
              value={formData.due_date}
              onChange={(e) =>
                setFormData({ ...formData, due_date: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-earth-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-earth-700">
              Notes
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
              className="mt-1 block w-full rounded-md border-earth-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading
                ? 'Saving...'
                : editingItem
                ? 'Update Item'
                : 'Create Item'}
            </button>
          </div>
        </form>
      </Modal>

      <div className="space-y-4">
        {categories.map((category) => {
          const categoryItems = items.filter(
            (item) => item.category === category
          )
          if (categoryItems.length === 0) return null

          return (
            <div key={category} className="card">
              <h2 className="text-lg font-medium text-earth-800 mb-4">
                {category}
              </h2>
              <div className="space-y-4">
                {categoryItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-earth-200">
                    <button
                      onClick={() => handleToggleComplete(item)}
                      className={`mt-1 h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                        item.completed
                          ? 'bg-primary border-primary'
                          : 'border-earth-300'
                      }`}>
                      {item.completed && (
                        <svg
                          className="h-3 w-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3
                            className={`text-base font-medium ${
                              item.completed
                                ? 'text-earth-400 line-through'
                                : 'text-earth-800'
                            }`}>
                            {item.title}
                          </h3>
                          {item.description && (
                            <p className="mt-1 text-sm text-earth-600">
                              {item.description}
                            </p>
                          )}
                          {item.due_date && (
                            <p className="mt-1 text-sm text-earth-500">
                              Due:{' '}
                              {new Date(item.due_date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-primary hover:text-primary-dark">
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-800">
                            Delete
                          </button>
                        </div>
                      </div>
                      {item.notes && (
                        <div className="mt-2 p-2 bg-earth-50 rounded text-sm text-earth-600">
                          {item.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {items.length === 0 && !showForm && (
          <div className="card text-center py-8">
            <p className="text-earth-600">No checklist items added yet.</p>
            <button
              onClick={() => {
                setEditingItem(null)
                setFormData({
                  title: '',
                  description: '',
                  category: 'Planning',
                  due_date: '',
                  notes: '',
                })
                setShowForm(true)
              }}
              className="mt-4 text-primary hover:text-primary-dark">
              Add your first item
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
