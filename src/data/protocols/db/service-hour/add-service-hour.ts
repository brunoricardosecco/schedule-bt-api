import { ServiceHour } from '@/domain/models/service-hour'

export type AddServiceHourRepositoryModel = {
  weekday: number
  startTime: string
  endTime: string
  companyId: string
}

export interface AddServiceHourRepository {
  add: (serviceHourData: AddServiceHourRepositoryModel) => Promise<ServiceHour>
}
