'use client'

import { createClient } from '@/lib/supabase/client'
import { Settings } from '@/types/settings'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const [settings, setSettings] = useState<Settings>({
    id: '',
    user_id: '',
    notifications: {
      email: true,
      sms: false,
      pushNotifications: true,
    },
    privacy: {
      shareWithVendors: true,
      publicProfile: false,
    },
    display: {
      darkMode: false,
      highContrast: false,
    },
    language: 'english',
    timezone: 'America/New_York',
    created_at: '',
    updated_at: '',
  })

  useEffect(() => {
    async function loadSettings() {
      try {
        const { data: userData } = await supabase.auth.getUser()
        if (!userData.user) {
          router.push('/login')
          return
        }

        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .eq('user_id', userData.user.id)
          .single()

        if (error) {
          if (error.code === 'PGRST116') {
            // No settings found, create default settings
            const { data: newSettings, error: insertError } = await supabase
              .from('settings')
              .insert({
                user_id: userData.user.id,
                notifications: settings.notifications,
                privacy: settings.privacy,
                display: settings.display,
                language: settings.language,
                timezone: settings.timezone,
              })
              .select()
              .single()

            if (insertError) throw insertError
            setSettings(newSettings)
          } else {
            throw error
          }
        } else {
          setSettings(data)
        }
      } catch (err) {
        console.error('Error loading settings:', err)
        setError('Failed to load settings')
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [router])

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [name]: checked,
      },
    })
  }

  const handlePrivacyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setSettings({
      ...settings,
      privacy: {
        ...settings.privacy,
        [name]: checked,
      },
    })
  }

  const handleDisplayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setSettings({
      ...settings,
      display: {
        ...settings.display,
        [name]: checked,
      },
    })
  }

  const handleGeneralChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setSettings({
      ...settings,
      [name]: value,
    })
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        router.push('/login')
        return
      }

      const { error: updateError } = await supabase
        .from('settings')
        .update({
          notifications: settings.notifications,
          privacy: settings.privacy,
          display: settings.display,
          language: settings.language,
          timezone: settings.timezone,
        })
        .eq('user_id', userData.user.id)

      if (updateError) throw updateError

      setSuccess(true)
    } catch (err) {
      console.error('Error saving settings:', err)
      setError('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Settings</h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage your account settings and preferences
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          Settings saved successfully!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-sm rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-medium mb-4 text-slate-800">
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label
                htmlFor="email"
                className="inline-block text-sm font-medium text-slate-700">
                Email Notifications
              </label>
              <input
                type="checkbox"
                id="email"
                name="email"
                className="h-4 w-4 text-slate-600 focus:ring-slate-500 border-slate-300 rounded"
                checked={settings.notifications.email}
                onChange={handleNotificationChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="sms"
                className="inline-block text-sm font-medium text-slate-700">
                SMS Notifications
              </label>
              <input
                type="checkbox"
                id="sms"
                name="sms"
                className="h-4 w-4 text-slate-600 focus:ring-slate-500 border-slate-300 rounded"
                checked={settings.notifications.sms}
                onChange={handleNotificationChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="pushNotifications"
                className="inline-block text-sm font-medium text-slate-700">
                Push Notifications
              </label>
              <input
                type="checkbox"
                id="pushNotifications"
                name="pushNotifications"
                className="h-4 w-4 text-slate-600 focus:ring-slate-500 border-slate-300 rounded"
                checked={settings.notifications.pushNotifications}
                onChange={handleNotificationChange}
              />
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-medium mb-4 text-slate-800">Privacy</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label
                htmlFor="shareWithVendors"
                className="inline-block text-sm font-medium text-slate-700">
                Share with Vendors
              </label>
              <input
                type="checkbox"
                id="shareWithVendors"
                name="shareWithVendors"
                className="h-4 w-4 text-slate-600 focus:ring-slate-500 border-slate-300 rounded"
                checked={settings.privacy.shareWithVendors}
                onChange={handlePrivacyChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="publicProfile"
                className="inline-block text-sm font-medium text-slate-700">
                Public Profile
              </label>
              <input
                type="checkbox"
                id="publicProfile"
                name="publicProfile"
                className="h-4 w-4 text-slate-600 focus:ring-slate-500 border-slate-300 rounded"
                checked={settings.privacy.publicProfile}
                onChange={handlePrivacyChange}
              />
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-medium mb-4 text-slate-800">Display</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label
                htmlFor="darkMode"
                className="inline-block text-sm font-medium text-slate-700">
                Dark Mode
              </label>
              <input
                type="checkbox"
                id="darkMode"
                name="darkMode"
                className="h-4 w-4 text-slate-600 focus:ring-slate-500 border-slate-300 rounded"
                checked={settings.display.darkMode}
                onChange={handleDisplayChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="highContrast"
                className="inline-block text-sm font-medium text-slate-700">
                High Contrast
              </label>
              <input
                type="checkbox"
                id="highContrast"
                name="highContrast"
                className="h-4 w-4 text-slate-600 focus:ring-slate-500 border-slate-300 rounded"
                checked={settings.display.highContrast}
                onChange={handleDisplayChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-medium mb-4 text-slate-800">
          General Settings
        </h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="language"
              className="block text-sm font-medium text-slate-700 mb-1">
              Language
            </label>
            <select
              id="language"
              name="language"
              className="block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
              value={settings.language}
              onChange={handleGeneralChange}>
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              <option value="german">German</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="timezone"
              className="block text-sm font-medium text-slate-700 mb-1">
              Timezone
            </label>
            <select
              id="timezone"
              name="timezone"
              className="block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
              value={settings.timezone}
              onChange={handleGeneralChange}>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}
