import {
  IconCurrencyDollar,
  IconUserPlus,
  IconShoppingCart,
  IconActivity,
} from '@tabler/icons-react'
import { AnalyticsCard } from './analytics-card'
import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/api'
import { Skeleton } from '@/components/ui/skeleton'

export const Analytics = () => {
  const { isLoading, data } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => await dashboardService.getAnalyticsData(),
  })

  if (isLoading) {
    return (
      <>
        <Skeleton className='h-32 rounded-xl' />
        <Skeleton className='h-32 rounded-xl' />
        <Skeleton className='h-32 rounded-xl' />
        <Skeleton className='h-32 rounded-xl' />
      </>
    )
  }

  if (data?.data) {
    const { totalRevenue, subscriptions, sales, activeNow } = data.data
    return (
      <>
        <AnalyticsCard
          title='Total Revenue'
          value={totalRevenue.value}
          percentageChange={totalRevenue.percentageChange}
          icon={
            <IconCurrencyDollar className='h-4 w-4 text-muted-foreground' />
          }
        />
        <AnalyticsCard
          title='Subscriptions'
          value={subscriptions.value}
          percentageChange={subscriptions.percentageChange}
          icon={<IconUserPlus className='h-4 w-4 text-muted-foreground' />}
        />
        <AnalyticsCard
          title='Sales'
          value={sales.value}
          percentageChange={sales.percentageChange}
          icon={<IconShoppingCart className='h-4 w-4 text-muted-foreground' />}
        />
        <AnalyticsCard
          title='Active Now'
          value={activeNow.value}
          percentageChange={activeNow.percentageChange}
          icon={<IconActivity className='h-4 w-4 text-muted-foreground' />}
        />
      </>
    )
  }

  return null
}
