import { DeleteServiceHour } from '@/data/usecases/delete-service-hour/delete-service-hour'
import { IDeleteServiceHour } from '@/domain/usecases/delete-service-hour'
import { ServiceHourPostgresRepository } from '@/infra/db/postgres/service-hour/service-hour-postgres-repository'

export const makeDeleteServiceHour = (): IDeleteServiceHour => {
  const serviceHourPostgresRepository = new ServiceHourPostgresRepository()

  return new DeleteServiceHour(serviceHourPostgresRepository, serviceHourPostgresRepository)
}
