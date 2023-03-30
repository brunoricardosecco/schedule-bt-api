import { ServiceHour } from '@/domain/models/serviceHour'

export type LoadServiceHoursByCompanyIdRepositoryModel = {
  companyId: string
  weekday: number
}

export interface LoadServiceHoursByCompanyIdAndWeekdayRepository {
  loadByCompanyIdAndWeekday: ({ companyId, weekday }: LoadServiceHoursByCompanyIdRepositoryModel) => Promise<ServiceHour[]>
}
