import { ServiceHour } from '@/domain/models/service-hour'

export interface IDeleteServiceHour {
  delete: (serviceHourId: string) => Promise<ServiceHour>
}
