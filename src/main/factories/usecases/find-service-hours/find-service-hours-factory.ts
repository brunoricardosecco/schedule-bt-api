import { FindServiceHours } from '@/data/usecases/find-service-hours/find-service-hours'
import { IFindServiceHours } from '@/domain/usecases/find-service-hours'
import { ServiceHourPostgresRepository } from '@/infra/db/postgres/service-hour/service-hour-postgres-repository'

export const makeFindServiceHours = (): IFindServiceHours => {
  const serviceHoursPostgresRepository = new ServiceHourPostgresRepository()

  return new FindServiceHours(serviceHoursPostgresRepository)
}
