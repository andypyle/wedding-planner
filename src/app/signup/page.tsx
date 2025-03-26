'use client'

import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [partnerName1, setPartnerName1] = useState('')
  const [partnerName2, setPartnerName2] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate form
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    if (!partnerName1 || !partnerName2) {
      setError('Please enter both partner names')
      return
    }

    setLoading(true)

    try {
      // 1. Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            partner1_name: partnerName1,
            partner2_name: partnerName2,
          },
        },
      })

      if (authError) {
        setError(authError.message)
        return
      }

      // 2. Create profile record
      if (authData?.user) {
        const { error: profileError } = await supabase.from('profiles').insert({
          id: authData.user.id,
          partner1_name: partnerName1,
          partner2_name: partnerName2,
        })

        if (profileError) {
          console.error('Error creating profile:', profileError)
          setError(
            'Account created but there was an error setting up your profile'
          )
          return
        }
      }

      // Success
      setSuccess(true)

      // Redirect to login after a brief delay to show success message
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (err) {
      console.error('Signup error:', err)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-earth-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold text-earth-900">
          Wedding Planner
        </h1>
        <h2 className="mt-6 text-center text-2xl font-bold text-earth-800">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              Success! Your account has been created. You will be redirected to
              login shortly.
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSignUp}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-earth-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-earth-300 rounded-md shadow-sm placeholder-earth-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-earth-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-earth-300 rounded-md shadow-sm placeholder-earth-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-earth-700">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-earth-300 rounded-md shadow-sm placeholder-earth-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-earth-800">
                Your Wedding Details
              </h3>

              <div>
                <label
                  htmlFor="partnerName1"
                  className="block text-sm font-medium text-earth-700">
                  Partner 1 Name
                </label>
                <div className="mt-1">
                  <input
                    id="partnerName1"
                    name="partnerName1"
                    type="text"
                    required
                    value={partnerName1}
                    onChange={(e) => setPartnerName1(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-earth-300 rounded-md shadow-sm placeholder-earth-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="partnerName2"
                  className="block text-sm font-medium text-earth-700">
                  Partner 2 Name
                </label>
                <div className="mt-1">
                  <input
                    id="partnerName2"
                    name="partnerName2"
                    type="text"
                    required
                    value={partnerName2}
                    onChange={(e) => setPartnerName2(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-earth-300 rounded-md shadow-sm placeholder-earth-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70">
                {loading ? 'Creating account...' : 'Sign up'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-earth-600">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-medium text-primary hover:text-primary-dark">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
