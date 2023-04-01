import { ServiceHour } from '@/domain/models/service-hour'

export type FindServiceHoursModel = {
  companyId?: string
  weekday?: number
}

export interface IFindServiceHours {
  find: ({ companyId, weekday }: FindServiceHoursModel) => Promise<ServiceHour[]>
}
