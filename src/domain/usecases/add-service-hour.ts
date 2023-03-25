import { ServiceHour } from '../models/service-hour'

export type AddServiceHourModel = {
  weekday: number
  startTime: string
  endTime: string
  companyId: string
}

export interface AddServiceHour {
  add: (serviceHour: AddServiceHourModel) => Promise<ServiceHour | Error>
}
