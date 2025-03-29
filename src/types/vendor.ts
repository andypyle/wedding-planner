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

export interface Payment {
  id: string
  vendor_id: string
  user_id: string
  amount: number
  date: string
  method: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Vendor {
  id: string
  user_id: string
  name: string
  category: VendorCategory
  contact_name: string
  contact_email: string
  contact_phone: string
  price: number
  notes: string
  status: VendorStatus
  remaining_balance: number
  payments: Payment[]
  created_at: string
  updated_at: string
}
