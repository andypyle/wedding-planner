'use client'

import { LoginForm } from '@/components/LoginForm/LoginForm'

import { Gabarito } from 'next/font/google'

const gabarito = Gabarito({
  subsets: ['latin'],
  weight: ['800'],
  variable: '--font-gabarito',
})

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1
          className={`${gabarito.className} text-center text-5xl font-extrabold text-slate-700`}>
          Wedding Planner
        </h1>
        <h2 className="mt-6 text-center text-2xl font-bold text-slate-600">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}
