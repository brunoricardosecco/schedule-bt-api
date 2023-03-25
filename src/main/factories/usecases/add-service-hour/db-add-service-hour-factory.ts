import { DbAddServiceHour } from '@/data/usecases/add-service-hour/db-add-service-hour'
import { AddServiceHour } from '@/domain/usecases/add-service-hour'
import { ServiceHourPostgresRepository } from '@/infra/db/postgres/service-hour/service-hour-postgres-repository'
import { DateFnsAdapter } from '@/infra/date/date-fns-adapter'

export const makeDbAddServiceHour = (): AddServiceHour => {
  const serviceHourPostgresRepository = new ServiceHourPostgresRepository()
  const timeService = new DateFnsAdapter()

  return new DbAddServiceHour(
    serviceHourPostgresRepository, serviceHourPostgresRepository,
    timeService
  )
}
