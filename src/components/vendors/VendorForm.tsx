'use client'

import { Payment, Vendor, VendorCategory, VendorStatus } from '@/types/vendor'
import { useState } from 'react'
import { VendorFormProps } from './types'

const VENDOR_CATEGORIES: VendorCategory[] = [
  'Venue',
  'Catering',
  'Photography',
  'Videography',
  'Florist',
  'Music',
  'Cake',
  'Decor',
  'Transportation',
  'Other',
]

const VENDOR_STATUSES: VendorStatus[] = [
  'Contacted',
  'Meeting Scheduled',
  'Booked',
  'Deposit Paid',
  'Paid in Full',
]

const PAYMENT_METHODS = [
  'Credit Card',
  'Bank Transfer',
  'Cash',
  'Check',
  'Other',
] as const

interface PaymentFormData {
  amount: number
  date: string
  method: Payment['method']
  notes: string
}

export function VendorForm({
  vendor,
  onSubmit,
  onCancel,
  onAddPayment,
  onDeletePayment,
  isSubmitting = false,
  isAddingPayment = false,
  isDeletingPayment = false,
}: VendorFormProps) {
  const [formData, setFormData] = useState<
    Omit<Vendor, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  >({
    name: vendor?.name || '',
    category: vendor?.category || 'Venue',
    contact_name: vendor?.contact_name || '',
    contact_email: vendor?.contact_email || '',
    contact_phone: vendor?.contact_phone || '',
    price: vendor?.price || 0,
    status: vendor?.status || 'Contacted',
    notes: vendor?.notes || '',
    remaining_balance: vendor?.remaining_balance || 0,
    payments: vendor?.payments || [],
  })

  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [paymentData, setPaymentData] = useState<PaymentFormData>({
    amount: 0,
    date: new Date().toISOString().substring(0, 10),
    method: 'Credit Card',
    notes: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'number'
          ? parseFloat(value) || 0
          : name === 'category'
          ? (value as VendorCategory)
          : name === 'status'
          ? (value as VendorStatus)
          : value,
    }))
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const price = Number(e.target.value)
    const totalPaid = formData.payments.reduce((sum, p) => sum + p.amount, 0)
    setFormData({
      ...formData,
      price,
      remaining_balance: price - totalPaid,
    })
  }

  const handleAddPayment = async () => {
    if (paymentData.amount <= 0) return

    await onAddPayment({
      amount: paymentData.amount,
      date: paymentData.date,
      method: paymentData.method,
      notes: paymentData.notes,
    })

    // Reset payment form
    setPaymentData({
      amount: 0,
      date: new Date().toISOString().substring(0, 10),
      method: 'Credit Card',
      notes: '',
    })
    setShowPaymentForm(false)
  }

  const handleDeletePayment = async (paymentId: string) => {
    await onDeletePayment(paymentId)
  }

  const totalPaid = formData.payments.reduce((sum, p) => sum + p.amount, 0)
  const paymentPercentage =
    formData.price > 0 ? Math.round((totalPaid / formData.price) * 100) : 0

  const isFormDisabled = isSubmitting || isAddingPayment || isDeletingPayment

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-slate-700">
            Vendor Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
            value={formData.name}
            onChange={handleChange}
            disabled={isFormDisabled}
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-slate-700">
            Category *
          </label>
          <select
            id="category"
            name="category"
            required
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
            value={formData.category}
            onChange={handleChange}
            disabled={isFormDisabled}>
            {VENDOR_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="contact_name"
            className="block text-sm font-medium text-slate-700">
            Contact Name *
          </label>
          <input
            type="text"
            id="contact_name"
            name="contact_name"
            required
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
            value={formData.contact_name}
            onChange={handleChange}
            disabled={isFormDisabled}
          />
        </div>

        <div>
          <label
            htmlFor="contact_email"
            className="block text-sm font-medium text-slate-700">
            Contact Email *
          </label>
          <input
            type="email"
            id="contact_email"
            name="contact_email"
            required
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
            value={formData.contact_email}
            onChange={handleChange}
            disabled={isFormDisabled}
          />
        </div>

        <div>
          <label
            htmlFor="contact_phone"
            className="block text-sm font-medium text-slate-700">
            Contact Phone *
          </label>
          <input
            type="tel"
            id="contact_phone"
            name="contact_phone"
            required
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
            value={formData.contact_phone}
            onChange={handleChange}
            disabled={isFormDisabled}
          />
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-slate-700">
            Price *
          </label>
          <input
            type="number"
            id="price"
            name="price"
            required
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
            value={formData.price}
            onChange={handlePriceChange}
            disabled={isFormDisabled}
          />
        </div>

        <div>
          <label
            htmlFor="remaining_balance"
            className="block text-sm font-medium text-slate-700">
            Remaining Balance *
          </label>
          <input
            type="number"
            id="remaining_balance"
            name="remaining_balance"
            required
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
            value={formData.remaining_balance}
            onChange={handleChange}
            disabled={isFormDisabled}
          />
        </div>

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-slate-700">
            Status *
          </label>
          <select
            id="status"
            name="status"
            required
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
            value={formData.status}
            onChange={handleChange}
            disabled={isFormDisabled}>
            {VENDOR_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-slate-700">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
            value={formData.notes}
            onChange={handleChange}
            disabled={isFormDisabled}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-slate-900">Payments</h3>
          <button
            type="button"
            onClick={() => setShowPaymentForm(!showPaymentForm)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500">
            {showPaymentForm ? 'Cancel' : 'Add Payment'}
          </button>
        </div>

        {showPaymentForm && (
          <div className="p-4 bg-slate-50 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Amount
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                  value={paymentData.amount}
                  onChange={(e) =>
                    setPaymentData({
                      ...paymentData,
                      amount: Number(e.target.value),
                    })
                  }
                  disabled={isFormDisabled}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Date
                </label>
                <input
                  type="date"
                  required
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                  value={paymentData.date}
                  onChange={(e) =>
                    setPaymentData({
                      ...paymentData,
                      date: e.target.value,
                    })
                  }
                  disabled={isFormDisabled}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Method
                </label>
                <select
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                  value={paymentData.method}
                  onChange={(e) =>
                    setPaymentData({
                      ...paymentData,
                      method: e.target.value as Payment['method'],
                    })
                  }
                  disabled={isFormDisabled}>
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Notes
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                  value={paymentData.notes}
                  onChange={(e) =>
                    setPaymentData({
                      ...paymentData,
                      notes: e.target.value,
                    })
                  }
                  disabled={isFormDisabled}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAddPayment}
                disabled={isAddingPayment}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500">
                {isAddingPayment ? 'Adding...' : 'Add Payment'}
              </button>
            </div>
          </div>
        )}

        {formData.payments.length > 0 && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-slate-200">
              {formData.payments.map((payment) => (
                <li key={payment.id} className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        ${payment.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-slate-500">
                        {new Date(payment.date).toLocaleDateString()} -{' '}
                        {payment.method}
                      </p>
                      {payment.notes && (
                        <p className="text-sm text-slate-500">
                          {payment.notes}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeletePayment(payment.id)}
                      disabled={isDeletingPayment}
                      className="text-sm text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Total Price:</span>
            <span className="font-medium">
              ${formData.price.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Total Paid:</span>
            <span className="font-medium">
              ${totalPaid.toLocaleString()} ({paymentPercentage}%)
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Remaining:</span>
            <span className="font-medium">
              ${formData.remaining_balance.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-slate-600 h-2 rounded-full"
              style={{ width: `${paymentPercentage}%` }}></div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
          disabled={isFormDisabled}>
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
          disabled={isFormDisabled}>
          {isSubmitting ? 'Saving...' : vendor ? 'Update Vendor' : 'Add Vendor'}
        </button>
      </div>
    </form>
  )
}
