import { ServiceHour } from '../models/serviceHour'

export type AddServiceHourModel = {
  weekday: number
  startTime: string
  endTime: string
  companyId: string
}

export interface IAddServiceHour {
  add: (serviceHour: AddServiceHourModel) => Promise<ServiceHour | Error>
}
