import { FindReservationSlots } from '@/data/usecases/find-reservation-slots/find-reservation-slots'
import { IFindReservationSlots } from '@/domain/usecases/find-reservation-slots'
import { DateFnsAdapter } from '@/infra/date/date-fns-adapter'
import { CompanyPostgresRepository } from '@/infra/db/postgres/company/company-postgres-repository'
import { ReservationPostgresRepository } from '@/infra/db/postgres/reservation/reservation-postgres-repository'
import { ServiceHourPostgresRepository } from '@/infra/db/postgres/service-hour/service-hour-postgres-repository'

export const makeFindReservationSlots = (): IFindReservationSlots => {
  const serviceHourPostgresRepository = new ServiceHourPostgresRepository()
  const companyPostgresRepository = new CompanyPostgresRepository()
  const reservationPostgresRepository = new ReservationPostgresRepository()
  const timeService = new DateFnsAdapter()

  return new FindReservationSlots(serviceHourPostgresRepository, companyPostgresRepository, reservationPostgresRepository, timeService)
}
