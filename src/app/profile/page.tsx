'use client'

import { ProfileForm } from '@/components/ProfileForm'
import { Toast } from '@/components/Toast/Toast'
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
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const { data: userData } = await supabase.auth.getUser()
        if (!userData.user) {
          router.push('/login')
          return
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userData.user.id)
          .single()

        if (profileError) {
          throw profileError
        }

        setUser(userData.user)
        setProfile(profileData)
      } catch (err) {
        console.error('Error fetching profile:', err)
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleSubmit = async (formData: any, noRefresh?: boolean) => {
    setError(null)
    setSuccess(false)

    try {
      if (!user) {
        router.push('/login')
        return
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user.id)

      if (updateError) {
        throw updateError
      }

      setProfile((prev) => (prev ? { ...prev, ...formData } : null))
      setSuccess(true)
    } catch (err) {
      console.error('Error updating profile:', err)
      setError('Failed to update profile. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Toast type="error" message={error} />
          <button
            onClick={() => window.location.reload()}
            className="text-slate-600 hover:text-slate-800">
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (!profile || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Profile not found</p>
          <button
            onClick={() => router.push('/signup')}
            className="text-slate-600 hover:text-slate-800">
            Create a profile
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">
          Profile Settings
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Update your wedding planning profile information
        </p>
      </div>

      {error && (
        <Toast type="error" message={error} onClose={() => setError(null)} />
      )}
      {success && (
        <Toast
          type="success"
          message="Profile updated successfully!"
          onClose={() => setSuccess(false)}
        />
      )}

      <div className="bg-white shadow-sm rounded-lg border border-slate-200">
        <div className="px-4 py-5 sm:p-6">
          <ProfileForm profile={profile} user={user} onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  )
}
