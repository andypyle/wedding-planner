import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { Payment, Vendor, VendorCategory } from '../types/vendor'

// Helper function to create a unique ID
const generateId = () => Math.random().toString(36).substr(2, 9)

// Placeholder data
const initialVendors: Vendor[] = [
  {
    id: '1',
    user_id: 'user123',
    name: 'Garden View Estate',
    category: 'Venue',
    contact_name: 'Sarah Johnson',
    contact_email: 'sarah@gardenview.com',
    contact_phone: '(555) 123-4567',
    price: 5000,
    payments: [
      {
        id: generateId(),
        vendor_id: '1',
        user_id: 'user123',
        amount: 1000,
        date: '2023-11-15',
        method: 'Credit Card',
        notes: 'Initial deposit',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: generateId(),
        vendor_id: '1',
        user_id: 'user123',
        amount: 500,
        date: '2024-01-10',
        method: 'Bank Transfer',
        notes: 'Second payment',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    remaining_balance: 3500,
    notes: 'Beautiful outdoor venue with indoor backup space',
    status: 'Deposit Paid',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    user_id: 'user123',
    name: 'Elegant Catering Co.',
    category: 'Catering',
    contact_name: 'Michael Chen',
    contact_email: 'michael@elegantcatering.com',
    contact_phone: '(555) 987-6543',
    price: 8500,
    payments: [
      {
        id: generateId(),
        vendor_id: '2',
        user_id: 'user123',
        amount: 2000,
        date: '2023-12-20',
        method: 'Check',
        notes: 'Booking deposit',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    remaining_balance: 6500,
    notes: 'Full-service catering with custom menu options',
    status: 'Booked',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    user_id: 'user123',
    name: 'Timeless Photography',
    category: 'Photography',
    contact_name: 'Jessica Miller',
    contact_email: 'jessica@timelessphotos.com',
    contact_phone: '(555) 456-7890',
    price: 3200,
    payments: [
      {
        id: generateId(),
        vendor_id: '3',
        user_id: 'user123',
        amount: 800,
        date: '2023-10-05',
        method: 'Credit Card',
        notes: 'Initial deposit',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: generateId(),
        vendor_id: '3',
        user_id: 'user123',
        amount: 200,
        date: '2023-12-15',
        method: 'Cash',
        notes: 'Additional payment',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    remaining_balance: 2200,
    notes: 'Photojournalistic style with candid shots',
    status: 'Deposit Paid',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export function useVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchVendors() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) throw new Error('No user found')

        const { data, error } = await supabase
          .from('vendors')
          .select('*, payments(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true })

        if (error) throw error
        setVendors(data || [])
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to fetch vendors')
        )
      } finally {
        setLoading(false)
      }
    }

    fetchVendors()
  }, [supabase])

  const addVendor = (
    vendor: Omit<Vendor, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ) => {
    const newVendor: Vendor = {
      ...vendor,
      id: generateId(),
      user_id: 'user123', // This would come from auth context in a real app
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setVendors([...vendors, newVendor])
  }

  const updateVendor = (id: string, updatedVendor: Partial<Vendor>) => {
    setVendors(
      vendors.map((vendor) =>
        vendor.id === id
          ? {
              ...vendor,
              ...updatedVendor,
              updated_at: new Date().toISOString(),
            }
          : vendor
      )
    )
  }

  const deleteVendor = (id: string) => {
    setVendors(vendors.filter((vendor) => vendor.id !== id))
  }

  const addPayment = (
    vendorId: string,
    payment: Omit<
      Payment,
      'id' | 'vendor_id' | 'user_id' | 'created_at' | 'updated_at'
    >
  ) => {
    const newPayment: Payment = {
      ...payment,
      id: generateId(),
      vendor_id: vendorId,
      user_id: 'user123', // This would come from auth context in a real app
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const vendor = vendors.find((v) => v.id === vendorId)

    if (vendor) {
      const updatedPayments = [...vendor.payments, newPayment]
      const totalPaid = updatedPayments.reduce((sum, p) => sum + p.amount, 0)
      const remaining_balance = vendor.price - totalPaid

      updateVendor(vendorId, {
        payments: updatedPayments,
        remaining_balance,
        status: remaining_balance <= 0 ? 'Paid in Full' : vendor.status,
      })
    }
  }

  const deletePayment = (vendorId: string, paymentId: string) => {
    const vendor = vendors.find((v) => v.id === vendorId)

    if (vendor) {
      const updatedPayments = vendor.payments.filter((p) => p.id !== paymentId)
      const totalPaid = updatedPayments.reduce((sum, p) => sum + p.amount, 0)
      const remaining_balance = vendor.price - totalPaid

      updateVendor(vendorId, {
        payments: updatedPayments,
        remaining_balance,
        status: updatedPayments.length === 0 ? 'Booked' : vendor.status,
      })
    }
  }

  const getVendorsByCategory = (category: VendorCategory) => {
    return vendors.filter((vendor) => vendor.category === category)
  }

  const getTotalBudget = () => {
    return vendors.reduce((total, vendor) => total + vendor.price, 0)
  }

  const getTotalPaid = () => {
    return vendors.reduce((total, vendor) => {
      const vendorPaid = vendor.payments.reduce(
        (sum, payment) => sum + payment.amount,
        0
      )
      return total + vendorPaid
    }, 0)
  }

  const getTotalRemainingBalance = () => {
    return vendors.reduce(
      (total, vendor) => total + vendor.remaining_balance,
      0
    )
  }

  return {
    vendors,
    loading,
    error,
    addVendor,
    updateVendor,
    deleteVendor,
    addPayment,
    deletePayment,
    getVendorsByCategory,
    getTotalBudget,
    getTotalPaid,
    getTotalRemainingBalance,
  }
}
