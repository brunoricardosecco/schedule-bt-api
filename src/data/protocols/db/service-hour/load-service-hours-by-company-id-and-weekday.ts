import { ServiceHour } from '@/domain/models/service-hour'

export type LoadServiceHoursByCompanyIdRepositoryModel = {
  companyId: string
  weekday: number
}

export interface LoadServiceHoursByCompanyIdAndWeekdayRepository {
  loadByCompanyIdAndWeekday: ({ companyId, weekday }: LoadServiceHoursByCompanyIdRepositoryModel) => Promise<ServiceHour[]>
}
