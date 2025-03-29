'use client'

import { ChecklistForm } from '@/components/ChecklistForm'
import { ConfirmDialog } from '@/components/ConfirmDialog/ConfirmDialog'
import { useChecklist } from '@/hooks/useChecklist'
import { ChecklistCategory, ChecklistItem } from '@/types/checklist'
import { useState } from 'react'

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

export default function ChecklistPage() {
  const { items, createItem, updateItem, deleteItem, isLoading } =
    useChecklist()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null)
  const [itemToDelete, setItemToDelete] = useState<ChecklistItem | null>(null)

  const handleSubmit = async (formData: any) => {
    if (editingItem) {
      await updateItem(editingItem.id, formData)
    } else {
      await createItem(formData)
    }
    setIsModalOpen(false)
    setEditingItem(null)
  }

  const handleEdit = (item: ChecklistItem) => {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const handleDelete = (item: ChecklistItem) => {
    setItemToDelete(item)
  }

  const handleToggleComplete = async (item: ChecklistItem) => {
    await updateItem(item.id, {
      completed: !item.completed,
      completed_at: !item.completed ? new Date().toISOString() : null,
    })
  }

  const confirmDelete = async () => {
    if (itemToDelete) {
      await deleteItem(itemToDelete.id)
      setItemToDelete(null)
    }
  }

  const itemsByCategory = categories.reduce((acc, category) => {
    acc[category] = items.filter((item) => item.category === category)
    return acc
  }, {} as Record<ChecklistCategory, ChecklistItem[]>)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Wedding Checklist
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Keep track of all your wedding planning tasks
          </p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null)
            setIsModalOpen(true)
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-200">
          <svg
            className="-ml-1 mr-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          Add Task
        </button>
      </div>

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="space-y-4">
          {categories.map((category) => {
            const categoryItems = itemsByCategory[category]
            if (categoryItems.length === 0) return null

            return (
              <div
                key={category}
                className="bg-slate-100 p-6 rounded-lg border border-slate-200">
                <h2 className="text-lg font-medium text-slate-800 mb-4">
                  {category}
                </h2>
                <div className="space-y-4">
                  {categoryItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-slate-200">
                      <button
                        onClick={() => handleToggleComplete(item)}
                        className={`mt-1 h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                          item.completed
                            ? 'bg-slate-600 border-slate-600'
                            : 'border-slate-300'
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
                                  ? 'text-slate-400 line-through'
                                  : 'text-slate-800'
                              }`}>
                              {item.title}
                            </h3>
                            {item.description && (
                              <p className="mt-1 text-sm text-slate-600">
                                {item.description}
                              </p>
                            )}
                            {item.due_date && (
                              <p className="mt-1 text-sm text-slate-500">
                                Due:{' '}
                                {new Date(item.due_date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="text-slate-600 hover:text-slate-800">
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item)}
                              className="text-red-600 hover:text-red-800">
                              Delete
                            </button>
                          </div>
                        </div>
                        {item.notes && (
                          <div className="mt-2 p-2 bg-slate-50 rounded text-sm text-slate-600">
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
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold mb-4">
              {editingItem ? 'Edit Item' : 'Add Item'}
            </h2>
            <ChecklistForm
              item={editingItem || undefined}
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsModalOpen(false)
                setEditingItem(null)
              }}
              isSubmitting={isLoading}
            />
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Checklist Item"
        message="Are you sure you want to delete this checklist item? This action cannot be undone."
      />
    </div>
  )
}
