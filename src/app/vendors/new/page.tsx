import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { NewVendorForm } from './NewVendorForm'

export default async function NewVendorPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    redirect('/login')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-earth-800">
          Add New Vendor
        </h1>
        <p className="mt-1 text-sm text-earth-600">
          Enter the details for your new vendor
        </p>
      </div>

      <div className="bg-surface rounded-lg shadow-sm border border-earth-200 overflow-hidden">
        <div className="p-6">
          <NewVendorForm />
        </div>
      </div>
    </div>
  )
}
