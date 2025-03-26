export interface Settings {
  id: string
  user_id: string
  notifications: {
    email: boolean
    sms: boolean
    pushNotifications: boolean
  }
  privacy: {
    shareWithVendors: boolean
    publicProfile: boolean
  }
  display: {
    darkMode: boolean
    highContrast: boolean
  }
  language: string
  timezone: string
  created_at: string
  updated_at: string
}
