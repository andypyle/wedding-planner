const projectId = 'hmpasypzghvyubqoojgn' // your supabase project id

export default function supabaseLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) {
  return `https://${projectId}.supabase.co/storage/v1/object/public/avatars/${src}?width=${width}&quality=${
    quality || 75
  }`
}
