'use client'

interface TimelineProgressProps {
  progress: number
}

export function TimelineProgress({ progress }: TimelineProgressProps) {
  return (
    <div className="mt-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm font-medium text-gray-700">{progress}%</span>
      </div>
      <p className="mt-1 text-sm text-gray-500">Overall Progress</p>
    </div>
  )
}
