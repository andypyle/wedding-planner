'use client'

import { Card, CardBody, CardHeader } from '@/components/Card/Card'
import { ProgressBar } from '@/components/ProgressBar'
import { BudgetOverviewProps } from './types'

export function BudgetOverview({ vendors }: BudgetOverviewProps) {
  const totalBudget = vendors.reduce((total, vendor) => total + vendor.price, 0)
  const totalPaid = vendors.reduce((total, vendor) => {
    const vendorPaid = (vendor.payments || []).reduce(
      (sum, payment) => sum + payment.amount,
      0
    )
    return total + vendorPaid
  }, 0)
  const remainingBalance = totalBudget - totalPaid
  const paymentPercentage =
    totalBudget > 0 ? Math.round((totalPaid / totalBudget) * 100) : 0

  // Count payments per vendor
  const totalPayments = vendors.reduce(
    (total, vendor) => total + (vendor.payments || []).length,
    0
  )

  return (
    <Card variant="bordered" theme="slate">
      <CardHeader>
        <h2 className="text-lg font-medium text-slate-800">Budget Overview</h2>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <h3 className="text-sm font-medium text-slate-600">Total Budget</h3>
            <p className="mt-1 text-2xl font-semibold text-slate-900">
              ${totalBudget.toLocaleString()}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-600">Paid to Date</h3>
            <p className="mt-1 text-2xl font-semibold text-slate-900">
              ${totalPaid.toLocaleString()}
              <span className="text-xs ml-1 text-slate-500">
                ({totalPayments} payment{totalPayments !== 1 ? 's' : ''})
              </span>
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-600">
              Remaining Balance
            </h3>
            <p className="mt-1 text-2xl font-semibold text-slate-900">
              ${remainingBalance.toLocaleString()}
            </p>
          </div>
        </div>

        <ProgressBar
          value={paymentPercentage}
          variant="success"
          showLabel={true}
          label={`${paymentPercentage}% of total budget paid`}
        />
      </CardBody>
    </Card>
  )
}
