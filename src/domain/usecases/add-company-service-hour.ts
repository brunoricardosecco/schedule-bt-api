import { ServiceHour } from '../models/serviceHour'

export type AddCompanyServiceHourModel = {
  weekday: number
  startTime: string
  endTime: string
  companyId: string
}

export interface AddCompanyServiceHour {
  add: (serviceHour: AddCompanyServiceHourModel) => Promise<ServiceHour>
}
