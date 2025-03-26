'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Profile {
  id: string
  partner1_name: string
  partner2_name: string
  wedding_date: string | null
  wedding_location: string | null
  wedding_venue: string | null
  total_budget: number
  created_at: string
  updated_at: string
}

interface FormErrors {
  partner1?: {
    name?: string
    email?: string
    phone?: string
  }
  partner2?: {
    name?: string
    email?: string
    phone?: string
  }
}

export default function CouplePage() {
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [profile, setProfile] = useState<Profile | null>(null)
  const [userEmail, setUserEmail] = useState<string>('')
  const supabase = createClient()
  const router = useRouter()

  const [couple, setCouple] = useState({
    partner1: {
      name: '',
      email: '',
      phone: '',
    },
    partner2: {
      name: '',
      email: '',
      phone: '',
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user
        const { data: userData } = await supabase.auth.getUser()
        if (!userData.user) {
          router.push('/login')
          return
        }

        // Get profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userData.user.id)
          .single()

        if (profileError) {
          console.error('Error fetching profile:', profileError)
          setError('Failed to load profile')
          return
        }

        setProfile(profileData)
        setUserEmail(userData.user.email || '')

        // Update couple state
        setCouple({
          partner1: {
            name: profileData?.partner1_name || '',
            email: userData.user.email || '',
            phone: '',
          },
          partner2: {
            name: profileData?.partner2_name || '',
            email: '',
            phone: '',
          },
        })
      } catch (err) {
        console.error('Error:', err)
        setError('An error occurred while loading your profile')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const validateField = (
    name: 'name' | 'email' | 'phone',
    value: string,
    partner: 'partner1' | 'partner2'
  ) => {
    const errors: FormErrors = { ...formErrors }

    if (!errors[partner]) {
      errors[partner] = {}
    }

    switch (name) {
      case 'name':
        if (!value.trim()) {
          errors[partner]!.name = 'Name is required'
        } else if (value.length < 2) {
          errors[partner]!.name = 'Name must be at least 2 characters'
        } else {
          delete errors[partner]!.name
        }
        break
      case 'email':
        if (
          partner === 'partner2' &&
          value &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ) {
          errors[partner]!.email = 'Please enter a valid email address'
        } else {
          delete errors[partner]!.email
        }
        break
      case 'phone':
        if (value && !/^\+?[\d\s-()]{10,}$/.test(value)) {
          errors[partner]!.phone = 'Please enter a valid phone number'
        } else {
          delete errors[partner]!.phone
        }
        break
    }

    setFormErrors(errors)
    return !errors[partner]?.[name]
  }

  const handlePartner1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    validateField(name as 'name' | 'email' | 'phone', value, 'partner1')

    setCouple({
      ...couple,
      partner1: {
        ...couple.partner1,
        [name]: value,
      },
    })
  }

  const handlePartner2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    validateField(name as 'name' | 'email' | 'phone', value, 'partner2')

    setCouple({
      ...couple,
      partner2: {
        ...couple.partner2,
        [name]: value,
      },
    })
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

      // Validate all fields before submitting
      const isPartner1Valid = validateField(
        'name',
        couple.partner1.name,
        'partner1'
      )
      const isPartner2Valid = validateField(
        'name',
        couple.partner2.name,
        'partner2'
      )
      const isPartner2EmailValid =
        !couple.partner2.email ||
        validateField('email', couple.partner2.email, 'partner2')
      const isPartner1PhoneValid =
        !couple.partner1.phone ||
        validateField('phone', couple.partner1.phone, 'partner1')
      const isPartner2PhoneValid =
        !couple.partner2.phone ||
        validateField('phone', couple.partner2.phone, 'partner2')

      if (
        !isPartner1Valid ||
        !isPartner2Valid ||
        !isPartner2EmailValid ||
        !isPartner1PhoneValid ||
        !isPartner2PhoneValid
      ) {
        setError('Please fix the errors before submitting')
        return
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          partner1_name: couple.partner1.name,
          partner2_name: couple.partner2.name,
        })
        .eq('id', userData.user.id)

      if (updateError) {
        console.error('Error updating profile:', updateError)
        throw updateError
      }

      setSuccess(true)
      router.refresh()
    } catch (err) {
      console.error('Error saving profile:', err)
      setError('Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-earth-800">
          Couple Details
        </h1>
        <p className="mt-1 text-sm text-earth-600">
          Tell us about you and your partner
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative">
          Profile updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <h2 className="text-lg font-medium text-earth-800 mb-4">Partner 1</h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="partner1-name"
                className="block text-sm font-medium text-earth-700">
                Full Name
              </label>
              <input
                type="text"
                id="partner1-name"
                name="name"
                value={couple.partner1.name}
                onChange={handlePartner1Change}
                className="mt-1 block w-full rounded-md border-earth-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                required
              />
              {formErrors.partner1?.name && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.partner1.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="partner1-email"
                className="block text-sm font-medium text-earth-700">
                Email
              </label>
              <input
                type="email"
                id="partner1-email"
                name="email"
                value={userEmail}
                disabled
                className="mt-1 block w-full rounded-md border-earth-300 bg-earth-50 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="partner1-phone"
                className="block text-sm font-medium text-earth-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="partner1-phone"
                name="phone"
                value={couple.partner1.phone}
                onChange={handlePartner1Change}
                className="mt-1 block w-full rounded-md border-earth-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
              {formErrors.partner1?.phone && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.partner1.phone}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-medium text-earth-800 mb-4">Partner 2</h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="partner2-name"
                className="block text-sm font-medium text-earth-700">
                Full Name
              </label>
              <input
                type="text"
                id="partner2-name"
                name="name"
                value={couple.partner2.name}
                onChange={handlePartner2Change}
                className="mt-1 block w-full rounded-md border-earth-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                required
              />
              {formErrors.partner2?.name && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.partner2.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="partner2-email"
                className="block text-sm font-medium text-earth-700">
                Email
              </label>
              <input
                type="email"
                id="partner2-email"
                name="email"
                value={couple.partner2.email}
                onChange={handlePartner2Change}
                className="mt-1 block w-full rounded-md border-earth-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
              {formErrors.partner2?.email && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.partner2.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="partner2-phone"
                className="block text-sm font-medium text-earth-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="partner2-phone"
                name="phone"
                value={couple.partner2.phone}
                onChange={handlePartner2Change}
                className="mt-1 block w-full rounded-md border-earth-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
              {formErrors.partner2?.phone && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.partner2.phone}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full sm:w-auto">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
