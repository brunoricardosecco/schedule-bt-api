import { FindReservationIntervals } from '@/data/usecases/find-reservation-intervals/find-reservation-intervals'
import { IFindReservationIntervals } from '@/domain/usecases/find-reservation-intervals'
import { DateFnsAdapter } from '@/infra/date/date-fns-adapter'
import { CompanyPostgresRepository } from '@/infra/db/postgres/company/company-postgres-repository'
import { ReservationPostgresRepository } from '@/infra/db/postgres/reservation/reservation-postgres-repository'
import { ServiceHourPostgresRepository } from '@/infra/db/postgres/service-hour/service-hour-postgres-repository'

export const makeReservationIntervals = (): IFindReservationIntervals => {
  const serviceHourPostgresRepository = new ServiceHourPostgresRepository()
  const companyPostgresRepository = new CompanyPostgresRepository()
  const reservationPostgresRepository = new ReservationPostgresRepository()
  const timeService = new DateFnsAdapter()

  return new FindReservationIntervals(serviceHourPostgresRepository, companyPostgresRepository, reservationPostgresRepository, timeService)
}
