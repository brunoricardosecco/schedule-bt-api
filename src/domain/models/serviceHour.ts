import { Company } from './company'

export type ServiceHour = {
  id: string
  weekday: number
  startTime: string
  endTime: string
  companyId: string
  company?: Company
}
