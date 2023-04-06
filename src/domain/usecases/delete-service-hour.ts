import { ServiceHour } from '@/domain/models/service-hour'

export interface IDeleteServiceHour {
  delete: ({ serviceHourId, companyId }: { serviceHourId: string, companyId: string }) => Promise<ServiceHour | Error>
}
