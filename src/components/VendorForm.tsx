'use client'

import { useEffect, useState } from 'react'
import { Payment, Vendor, VendorCategory, VendorStatus } from '../types/vendor'

interface VendorFormProps {
  vendor?: Vendor
  onSubmit: (
    vendor: Omit<Vendor, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ) => void
  onCancel: () => void
  onAddPayment: (
    payment: Omit<
      Payment,
      'id' | 'vendor_id' | 'user_id' | 'created_at' | 'updated_at'
    >
  ) => void
  onDeletePayment: (paymentId: string) => void
  isSubmitting?: boolean
  isAddingPayment?: boolean
  isDeletingPayment?: boolean
}

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

interface VendorFormData {
  name: string
  category: VendorCategory
  contact_name: string
  contact_email: string
  contact_phone: string
  price: number
  payments: Payment[]
  remaining_balance: number
  notes: string
  status: VendorStatus
}

export const VendorForm = ({
  vendor,
  onSubmit,
  onCancel,
  onAddPayment,
  onDeletePayment,
  isSubmitting = false,
  isAddingPayment = false,
  isDeletingPayment = false,
}: VendorFormProps) => {
  const [formData, setFormData] = useState<VendorFormData>({
    name: '',
    category: 'Venue',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    price: 0,
    payments: [],
    remaining_balance: 0,
    notes: '',
    status: 'Contacted',
  })

  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [paymentData, setPaymentData] = useState<PaymentFormData>({
    amount: 0,
    date: new Date().toISOString().substring(0, 10),
    method: 'Credit Card',
    notes: '',
  })

  useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.name,
        category: vendor.category,
        contact_name: vendor.contact_name || '',
        contact_email: vendor.contact_email || '',
        contact_phone: vendor.contact_phone || '',
        price: vendor.price,
        payments: vendor.payments,
        remaining_balance: vendor.remaining_balance,
        notes: vendor.notes || '',
        status: vendor.status,
      })
    }
  }, [vendor])

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const totalPaid = formData.payments.reduce((sum, p) => sum + p.amount, 0)
  const paymentPercentage =
    formData.price > 0 ? Math.round((totalPaid / formData.price) * 100) : 0

  const isFormDisabled = isSubmitting || isAddingPayment || isDeletingPayment

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Name</label>
          <input
            type="text"
            required
            className="input"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={isFormDisabled}
          />
        </div>

        <div>
          <label className="label">Category</label>
          <select
            className="input"
            value={formData.category}
            onChange={(e) =>
              setFormData({
                ...formData,
                category: e.target.value as VendorCategory,
              })
            }
            disabled={isFormDisabled}>
            {VENDOR_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Contact Name</label>
          <input
            type="text"
            required
            className="input"
            value={formData.contact_name}
            onChange={(e) =>
              setFormData({ ...formData, contact_name: e.target.value })
            }
            disabled={isFormDisabled}
          />
        </div>

        <div>
          <label className="label">Email</label>
          <input
            type="email"
            required
            className="input"
            value={formData.contact_email}
            onChange={(e) =>
              setFormData({ ...formData, contact_email: e.target.value })
            }
            disabled={isFormDisabled}
          />
        </div>

        <div>
          <label className="label">Phone</label>
          <input
            type="tel"
            required
            className="input"
            value={formData.contact_phone}
            onChange={(e) =>
              setFormData({ ...formData, contact_phone: e.target.value })
            }
            disabled={isFormDisabled}
          />
        </div>

        <div>
          <label className="label">Total Price</label>
          <input
            type="number"
            required
            min="0"
            className="input"
            value={formData.price}
            onChange={handlePriceChange}
            disabled={isFormDisabled}
          />
        </div>

        <div>
          <label className="label">Status</label>
          <select
            className="input"
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as VendorStatus,
              })
            }
            disabled={isFormDisabled}>
            {VENDOR_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="label">Notes</label>
          <textarea
            className="input"
            rows={3}
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            disabled={isFormDisabled}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-earth-900">Payments</h3>
          <button
            type="button"
            onClick={() => setShowPaymentForm(true)}
            className="btn-primary"
            disabled={isFormDisabled}>
            Add Payment
          </button>
        </div>

        {showPaymentForm && (
          <div className="p-4 bg-earth-50 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Amount</label>
                <input
                  type="number"
                  required
                  min="0"
                  className="input"
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
                <label className="label">Date</label>
                <input
                  type="date"
                  required
                  className="input"
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
                <label className="label">Method</label>
                <select
                  className="input"
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
                <label className="label">Notes</label>
                <input
                  type="text"
                  className="input"
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

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPaymentForm(false)}
                className="btn-secondary"
                disabled={isFormDisabled}>
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddPayment}
                className="btn-primary"
                disabled={isFormDisabled || isAddingPayment}>
                {isAddingPayment ? 'Adding Payment...' : 'Add Payment'}
              </button>
            </div>
          </div>
        )}

        {formData.payments.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-earth-200">
              <thead className="bg-earth-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-earth-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-earth-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-earth-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-earth-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-earth-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-earth-200">
                {formData.payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-earth-900">
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-earth-900">
                      ${payment.amount.toLocaleString()}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-earth-900">
                      {payment.method}
                    </td>
                    <td className="px-3 py-2 text-sm text-earth-900">
                      {payment.notes}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-right text-sm">
                      <button
                        type="button"
                        onClick={() => handleDeletePayment(payment.id)}
                        className="text-red-500 hover:text-red-700"
                        disabled={isFormDisabled || isDeletingPayment}>
                        {isDeletingPayment ? 'Removing...' : 'Remove'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-earth-600">Total Price:</span>
            <span className="font-medium">
              ${formData.price.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-earth-600">Total Paid:</span>
            <span className="font-medium">
              ${totalPaid.toLocaleString()} ({paymentPercentage}%)
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-earth-600">Remaining:</span>
            <span className="font-medium">
              ${formData.remaining_balance.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-earth-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full"
              style={{ width: `${paymentPercentage}%` }}></div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
          disabled={isFormDisabled}>
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={isFormDisabled || isSubmitting}>
          {isSubmitting
            ? vendor
              ? 'Updating...'
              : 'Creating...'
            : vendor
            ? 'Update Vendor'
            : 'Create Vendor'}
        </button>
      </div>
    </form>
  )
}
