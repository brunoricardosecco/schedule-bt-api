import { ServiceHour } from '@/domain/models/service-hour'

export interface DeleteServiceHourRepository {
  delete: (serviceHourId: string) => Promise<ServiceHour>
}
