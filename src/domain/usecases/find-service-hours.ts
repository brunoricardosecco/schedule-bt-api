import { ServiceHour } from '@/domain/models/serviceHour'

export type FindServiceHoursModel = {
  companyId?: string
  weekday?: number
}

export interface FindServiceHours {
  find: ({ companyId, weekday }: FindServiceHoursModel) => Promise<ServiceHour[]>
}
