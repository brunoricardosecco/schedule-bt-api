import { DbFindServiceHours } from '@/data/usecases/find-service-hours/db-find-service-hours'
import { FindServiceHours } from '@/domain/usecases/find-service-hours'
import { ServiceHourPostgresRepository } from '@/infra/db/postgres/service-hour/service-hour-postgres-repository'

export const makeDbFindServiceHours = (): FindServiceHours => {
  const serviceHoursPostgresRepository = new ServiceHourPostgresRepository()

  return new DbFindServiceHours(serviceHoursPostgresRepository)
}
