'use client'

import { DaysUntilWeddingProps } from './types'

export function DaysUntilWedding({ weddingDate }: DaysUntilWeddingProps) {
  if (!weddingDate) {
    return (
      <div className="overflow-hidden shadow-sm rounded-lg border border-slate-200 bg-slate-100">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-slate-800 mb-3">
            Days Until Wedding
          </h3>
          <p className="text-4xl font-bold text-slate-900">No date set</p>
          <p className="mt-2 text-lg text-slate-600">
            Please set your wedding date in settings
          </p>
        </div>
      </div>
    )
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const weddingDateStart = new Date(weddingDate)
  weddingDateStart.setHours(0, 0, 0, 0)
  const diffTime = weddingDateStart.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  let message = ''
  let subMessage = ''

  if (diffDays > 0) {
    message = `${diffDays} days`
    subMessage = 'until your wedding!'
  } else if (diffDays === 0) {
    message = "It's your wedding day!"
    subMessage = '🎉 Congratulations! 🎉'
  } else {
    message = 'Your wedding has passed'
    subMessage = `${Math.abs(diffDays)} days ago`
  }

  return (
    <div className="overflow-hidden shadow-sm rounded-lg border border-slate-200 bg-slate-100">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-slate-800 mb-3">
          Days Until Wedding
        </h3>
        <p className="text-4xl font-bold text-slate-900">{message}</p>
        {subMessage && (
          <p className="mt-2 text-lg text-slate-600">{subMessage}</p>
        )}
      </div>
    </div>
  )
}
