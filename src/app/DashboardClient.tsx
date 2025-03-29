'use client'

import { BudgetOverview } from '@/components/BudgetOverview'
import { ChecklistStats } from '@/components/ChecklistStats'
import { DaysUntilWedding } from '@/components/DaysUntilWedding'
import { GuestOverview } from '@/components/GuestOverview'
import { QuickStats } from '@/components/QuickStats'
import { ChecklistItem } from '@/types/checklist'
import { Guest } from '@/types/guest'
import { Vendor } from '@/types/vendor'

interface DashboardClientProps {
  guests: Guest[]
  vendors: Vendor[]
  checklistItems: ChecklistItem[]
  weddingDate: Date
}

export default function DashboardClient({
  guests,
  vendors,
  checklistItems,
  weddingDate,
}: DashboardClientProps) {
  return (
    <div className="space-y-6">
      <DaysUntilWedding weddingDate={weddingDate} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GuestOverview guests={guests} />
        <BudgetOverview vendors={vendors} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChecklistStats items={checklistItems} />
        <QuickStats vendors={vendors} />
      </div>
    </div>
  )
}
