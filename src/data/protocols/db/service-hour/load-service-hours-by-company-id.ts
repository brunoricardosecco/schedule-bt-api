import { ServiceHour } from '@/domain/models/serviceHour'

export interface LoadServiceHoursByCompanyIdRepository {
  load: (companyId: string) => Promise<ServiceHour[]>
}
