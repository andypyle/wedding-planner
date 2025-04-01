'use client'

import { Button } from '@/components/Button/Button'
import { ConfirmDialog } from '@/components/ConfirmDialog/ConfirmDialog'
import {
  Form,
  FormGroup,
  FormInput,
  FormPriceInput,
  FormSelect,
  FormTextarea,
} from '@/components/Form/Form'
import { Grid } from '@/components/Grid/Grid'
import { GridItem } from '@/components/Grid/GridItem'
import { useState } from 'react'
import { VendorCategory, VendorFormProps, VendorStatus } from './types'

export function VendorForm({
  vendor,
  onSubmit,
  onCancel,
  onAddPayment,
  onDeletePayment,
  isSubmitting,
  isAddingPayment,
  isDeletingPayment,
}: VendorFormProps) {
  const [formData, setFormData] = useState<{
    name: string
    category: VendorCategory
    contact_name: string
    contact_email: string
    contact_phone: string
    price: string
    notes: string
    status: VendorStatus
  }>(
    vendor
      ? {
          name: vendor.name,
          category: vendor.category,
          contact_name: vendor.contact_name,
          contact_email: vendor.contact_email,
          contact_phone: vendor.contact_phone,
          price: vendor.price.toString(),
          notes: vendor.notes,
          status: vendor.status,
        }
      : {
          name: '',
          category: 'Venue' as VendorCategory,
          contact_name: '',
          contact_email: '',
          contact_phone: '',
          price: '',
          notes: '',
          status: 'Contacted' as VendorStatus,
        }
  )

  const [newPayment, setNewPayment] = useState<{
    amount: string
    date: string
    method: string
    notes: string
  }>({
    amount: '',
    date: '',
    method: 'cash',
    notes: '',
  })

  const [paymentToDelete, setPaymentToDelete] = useState<string | null>(null)

  // Calculate remaining balance based on price and payments
  const calculateRemainingBalance = () => {
    const totalPayments = (vendor?.payments ?? []).reduce(
      (sum, payment) => sum + (payment?.amount ?? 0),
      0
    )
    const price = formData.price ? Number(formData.price) : 0
    return price - totalPayments
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await onSubmit({
        ...formData,
        price: formData.price ? Number(formData.price) : 0,
      })
      onCancel() // Close the modal after successful submission
    } catch (error) {
      console.error('Error submitting vendor:', error)
    }
  }

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault()
    onAddPayment({
      ...newPayment,
      amount: newPayment.amount ? Number(newPayment.amount) : 0,
    })
    setNewPayment({
      amount: '',
      date: '',
      method: 'cash',
      notes: '',
    })
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePaymentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setNewPayment((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDeletePaymentClick = (paymentId: string) => {
    setPaymentToDelete(paymentId)
  }

  const handleConfirmDeletePayment = () => {
    if (paymentToDelete) {
      onDeletePayment(paymentToDelete)
      setPaymentToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      <form id="vendor-form" onSubmit={handleSubmit} className="space-y-6">
        <Grid cols={1} sm={2} gap={6}>
          <GridItem>
            <FormGroup label="Vendor Name" htmlFor="name" required>
              <FormInput
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
          </GridItem>

          <GridItem>
            <FormGroup label="Category" htmlFor="category" required>
              <FormSelect
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                options={[
                  { value: 'Venue', label: 'Venue' },
                  { value: 'Catering', label: 'Catering' },
                  { value: 'Photography', label: 'Photography' },
                  { value: 'Videography', label: 'Videography' },
                  { value: 'Florist', label: 'Florist' },
                  { value: 'Music', label: 'Music' },
                  { value: 'Cake', label: 'Cake' },
                  { value: 'Decor', label: 'Decor' },
                  { value: 'Transportation', label: 'Transportation' },
                  { value: 'Other', label: 'Other' },
                ]}
              />
            </FormGroup>
          </GridItem>

          <GridItem>
            <FormGroup label="Contact Name" htmlFor="contact_name" required>
              <FormInput
                id="contact_name"
                name="contact_name"
                value={formData.contact_name}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
          </GridItem>

          <GridItem>
            <FormGroup label="Contact Email" htmlFor="contact_email" required>
              <FormInput
                id="contact_email"
                name="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
          </GridItem>

          <GridItem>
            <FormGroup label="Contact Phone" htmlFor="contact_phone" required>
              <FormInput
                id="contact_phone"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
          </GridItem>

          <GridItem>
            <FormGroup label="Total Price" htmlFor="price" required>
              <FormPriceInput
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
          </GridItem>

          <GridItem>
            <FormGroup label="Status" htmlFor="status" required>
              <FormSelect
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
                options={[
                  { value: 'Contacted', label: 'Contacted' },
                  { value: 'Meeting Scheduled', label: 'Meeting Scheduled' },
                  { value: 'Booked', label: 'Booked' },
                  { value: 'Deposit Paid', label: 'Deposit Paid' },
                  { value: 'Paid in Full', label: 'Paid in Full' },
                ]}
              />
            </FormGroup>
          </GridItem>

          <GridItem>
            <FormGroup label="Notes" htmlFor="notes">
              <FormTextarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
              />
            </FormGroup>
          </GridItem>
        </Grid>
      </form>

      {vendor && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-slate-900">Payments</h3>
          <div className="space-y-4">
            <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2">
              {(vendor.payments ?? []).map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <div className="font-medium text-slate-900">
                      $
                      {payment.amount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                    <div className="text-sm text-slate-500">
                      {new Date(payment.date).toLocaleDateString()} -{' '}
                      {payment.method}
                    </div>
                    {payment.notes && (
                      <div className="text-sm text-slate-500 mt-1">
                        {payment.notes}
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleDeletePaymentClick(payment.id)}
                    className="ml-4">
                    Delete
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center p-4 bg-slate-100 rounded-lg sticky bottom-0">
              <div className="text-sm font-medium text-slate-600">
                Remaining Balance
              </div>
              <div className="text-lg font-semibold text-slate-900">
                $
                {calculateRemainingBalance().toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
          </div>

          <Form onSubmit={handleAddPayment} className="space-y-4">
            <Grid cols={1} sm={2} gap={4}>
              <GridItem>
                <FormGroup label="Amount" htmlFor="payment_amount" required>
                  <FormPriceInput
                    id="payment_amount"
                    name="amount"
                    value={newPayment.amount}
                    onChange={handlePaymentChange}
                    required
                  />
                </FormGroup>
              </GridItem>

              <GridItem>
                <FormGroup label="Date" htmlFor="payment_date" required>
                  <FormInput
                    id="payment_date"
                    name="date"
                    type="date"
                    value={newPayment.date}
                    onChange={handlePaymentChange}
                    required
                  />
                </FormGroup>
              </GridItem>

              <GridItem>
                <FormGroup
                  label="Payment Method"
                  htmlFor="payment_method"
                  required>
                  <FormSelect
                    id="payment_method"
                    name="method"
                    value={newPayment.method}
                    onChange={handlePaymentChange}
                    required
                    options={[
                      { value: 'cash', label: 'Cash' },
                      { value: 'check', label: 'Check' },
                      { value: 'credit', label: 'Credit Card' },
                      { value: 'bank_transfer', label: 'Bank Transfer' },
                    ]}
                  />
                </FormGroup>
              </GridItem>

              <GridItem>
                <FormGroup label="Notes" htmlFor="payment_notes">
                  <FormInput
                    id="payment_notes"
                    name="notes"
                    value={newPayment.notes}
                    onChange={handlePaymentChange}
                    placeholder="e.g., Deposit payment"
                  />
                </FormGroup>
              </GridItem>
            </Grid>

            <div className="flex justify-end">
              <Button
                type="submit"
                loading={isAddingPayment}
                variant="success"
                size="sm"
                disabled={!newPayment.amount}>
                Add Payment
              </Button>
            </div>
          </Form>
        </div>
      )}

      <div className="flex justify-end space-x-3 mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" form="vendor-form" loading={isSubmitting}>
          Save Changes
        </Button>
      </div>

      <ConfirmDialog
        isOpen={!!paymentToDelete}
        onClose={() => setPaymentToDelete(null)}
        onConfirm={handleConfirmDeletePayment}
        title="Delete Payment"
        message="Are you sure you want to delete this payment? This action cannot be undone."
        isLoading={isDeletingPayment}
      />
    </div>
  )
}
