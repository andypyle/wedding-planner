'use client'

import { useState } from 'react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
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
  })

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-earth-800">Settings</h1>
        <p className="mt-1 text-sm text-earth-600">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h2 className="text-lg font-medium mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label
                htmlFor="email"
                className="inline-block text-sm font-medium text-earth-700">
                Email Notifications
              </label>
              <input
                type="checkbox"
                id="email"
                name="email"
                className="h-4 w-4 text-primary focus:ring-primary border-earth-300 rounded"
                checked={settings.notifications.email}
                onChange={handleNotificationChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="sms"
                className="inline-block text-sm font-medium text-earth-700">
                SMS Notifications
              </label>
              <input
                type="checkbox"
                id="sms"
                name="sms"
                className="h-4 w-4 text-primary focus:ring-primary border-earth-300 rounded"
                checked={settings.notifications.sms}
                onChange={handleNotificationChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="pushNotifications"
                className="inline-block text-sm font-medium text-earth-700">
                Push Notifications
              </label>
              <input
                type="checkbox"
                id="pushNotifications"
                name="pushNotifications"
                className="h-4 w-4 text-primary focus:ring-primary border-earth-300 rounded"
                checked={settings.notifications.pushNotifications}
                onChange={handleNotificationChange}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-medium mb-4">Privacy</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label
                htmlFor="shareWithVendors"
                className="inline-block text-sm font-medium text-earth-700">
                Share Info with Vendors
              </label>
              <input
                type="checkbox"
                id="shareWithVendors"
                name="shareWithVendors"
                className="h-4 w-4 text-primary focus:ring-primary border-earth-300 rounded"
                checked={settings.privacy.shareWithVendors}
                onChange={handlePrivacyChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="publicProfile"
                className="inline-block text-sm font-medium text-earth-700">
                Public Profile
              </label>
              <input
                type="checkbox"
                id="publicProfile"
                name="publicProfile"
                className="h-4 w-4 text-primary focus:ring-primary border-earth-300 rounded"
                checked={settings.privacy.publicProfile}
                onChange={handlePrivacyChange}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-medium mb-4">Display</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label
                htmlFor="darkMode"
                className="inline-block text-sm font-medium text-earth-700">
                Dark Mode
              </label>
              <input
                type="checkbox"
                id="darkMode"
                name="darkMode"
                className="h-4 w-4 text-primary focus:ring-primary border-earth-300 rounded"
                checked={settings.display.darkMode}
                onChange={handleDisplayChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="highContrast"
                className="inline-block text-sm font-medium text-earth-700">
                High Contrast
              </label>
              <input
                type="checkbox"
                id="highContrast"
                name="highContrast"
                className="h-4 w-4 text-primary focus:ring-primary border-earth-300 rounded"
                checked={settings.display.highContrast}
                onChange={handleDisplayChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-medium mb-4">General Settings</h2>
        <div className="space-y-4 max-w-md">
          <div>
            <label htmlFor="language" className="label">
              Language
            </label>
            <select
              id="language"
              name="language"
              className="input"
              value={settings.language}
              onChange={handleGeneralChange}>
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
            </select>
          </div>

          <div>
            <label htmlFor="timezone" className="label">
              Time Zone
            </label>
            <select
              id="timezone"
              name="timezone"
              className="input"
              value={settings.timezone}
              onChange={handleGeneralChange}>
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <button className="btn-primary">Save Settings</button>
        </div>
      </div>
    </div>
  )
}
