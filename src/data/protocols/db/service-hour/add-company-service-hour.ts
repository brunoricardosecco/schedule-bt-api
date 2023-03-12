import { ServiceHour } from '@/domain/models/serviceHour'

export type AddCompanyServiceHourRepositoryModel = {
  weekday: number
  startTime: string
  endTime: string
  companyId: string
}

export interface AddCompanyServiceHourRepository {
  add: (serviceHourData: AddCompanyServiceHourRepositoryModel) => Promise<ServiceHour>
}
