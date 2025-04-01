'use client'

import { createClient } from '@/lib/supabase/client'
import cn from 'classnames'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface ImageUploadProps {
  currentImageUrl?: string | null
  onUploadComplete: (url: string) => void
  bucket: string
  folder: string
  maxSize?: number // in MB
  disabled?: boolean
}

export function ImageUpload({
  currentImageUrl = null,
  onUploadComplete,
  bucket = 'avatars',
  folder = 'profile',
  maxSize = 2 * 1024 * 1024, // 2MB
  disabled = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [delayedUploading, setDelayedUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl)
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      }
    }
    getUser()
  }, [supabase.auth])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (disabled) {
      e.target.value = ''
      return
    }

    if (!userId) {
      setError('You must be logged in to upload an image')
      return
    }

    // Validate file size
    if (file.size > maxSize) {
      setError('File size must be less than 2MB')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('File must be an image')
      return
    }

    try {
      setUploading(true)
      setDelayedUploading(true)
      setError(null)

      // Generate unique filename and use userId as folder
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${file.name}`
      const filePath = `${folder}/${userId}/${fileName}`

      console.log('Uploading to path:', filePath)

      // Upload the file with upsert enabled
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw uploadError
      }

      setPreviewUrl(filePath)
      onUploadComplete(filePath)
    } catch (err) {
      console.error('Error uploading image:', err)
      setError('Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
      setTimeout(() => {
        setDelayedUploading(false)
      }, 2000)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-slate-100">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Profile"
              fill
              sizes="80px"
              className={cn(
                'object-contain rounded-full w-full h-full transition-[filter] duration-500',
                {
                  'blur-md grayscale': delayedUploading,
                }
              )}
              style={{ padding: '4px' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-2xl text-slate-400">U</span>
            </div>
          )}
        </div>
        <div>
          <label
            htmlFor="profile-photo"
            className={`inline-flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}>
            {uploading ? 'Uploading...' : 'Change photo'}
          </label>
          <input
            id="profile-photo"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled || uploading}
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <p className="text-xs text-slate-500">
        Maximum file size: {maxSize / 1024 / 1024}MB. Supported formats: JPG,
        PNG, GIF
      </p>
    </div>
  )
}
