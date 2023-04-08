import { AddServiceHour } from '@/data/usecases/add-service-hour/add-service-hour'
import { IAddServiceHour } from '@/domain/usecases/add-service-hour'
import { DateFnsAdapter } from '@/infra/date/date-fns-adapter'
import { ServiceHourPostgresRepository } from '@/infra/db/postgres/service-hour/service-hour-postgres-repository'

export const makeAddServiceHour = (): IAddServiceHour => {
  const serviceHourPostgresRepository = new ServiceHourPostgresRepository()
  const timeService = new DateFnsAdapter()

  return new AddServiceHour(serviceHourPostgresRepository, serviceHourPostgresRepository, timeService)
}
