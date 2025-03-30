'use client'

import { SignupForm } from '@/components/SignupForm/SignupForm'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold text-slate-700">
          Wedding Planner
        </h1>
        <h2 className="mt-6 text-center text-2xl font-bold text-slate-600">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <SignupForm />
      </div>
    </div>
  )
}
