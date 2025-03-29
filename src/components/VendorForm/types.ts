import { Vendor } from '@/types/vendor'

export type VendorCategory =
  | 'Venue'
  | 'Catering'
  | 'Photography'
  | 'Videography'
  | 'Florist'
  | 'Music'
  | 'Cake'
  | 'Decor'
  | 'Transportation'
  | 'Other'

export type VendorStatus =
  | 'Contacted'
  | 'Meeting Scheduled'
  | 'Booked'
  | 'Deposit Paid'
  | 'Paid in Full'

export type NewVendorData = Omit<
  Vendor,
  | 'id'
  | 'user_id'
  | 'created_at'
  | 'updated_at'
  | 'remaining_balance'
  | 'payments'
>

export interface Payment {
  id: string
  amount: number
  date: string
  method: string
  notes?: string
}

export interface VendorFormData {
  name: string
  category: VendorCategory
  contact_name: string
  contact_email: string
  contact_phone: string
  price: number
  notes: string
  status: VendorStatus
}

export interface VendorFormProps {
  vendor?: Vendor
  onSubmit: (vendor: NewVendorData) => void
  onCancel: () => void
  onAddPayment: (
    payment: Omit<
      Vendor['payments'][0],
      'id' | 'vendor_id' | 'user_id' | 'created_at' | 'updated_at'
    >
  ) => void
  onDeletePayment: (paymentId: string) => void
  isSubmitting?: boolean
  isAddingPayment?: boolean
  isDeletingPayment?: boolean
}
