import { ServiceHour } from '@/domain/models/serviceHour'

export type FindServiceHoursRepositoryParams = {
  companyId?: string
  weekday?: number
}

export interface FindServiceHoursRepository {
  findBy: (params: FindServiceHoursRepositoryParams) => Promise<ServiceHour[]>
}
