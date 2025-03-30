/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    loader: 'custom',
    loaderFile: './src/lib/supabase-image-loader.ts',
  },
}

module.exports = nextConfig
