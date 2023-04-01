import { ServiceHour } from '@/domain/models/service-hour'

export type FindServiceHoursRepositoryParams = {
  companyId?: string
  weekday?: number
}

export interface FindServiceHoursRepository {
  findBy: (params: FindServiceHoursRepositoryParams) => Promise<ServiceHour[]>
}
