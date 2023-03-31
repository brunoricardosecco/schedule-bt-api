import { ReservationInterval } from '@/domain/models/reservation-interval'
import { IFindReservationIntervals } from '@/domain/usecases/find-reservation-intervals'
import { FindServiceHoursRepository } from '../find-service-hours/find-service-hours.protocols'

export class FindReservationIntervals implements IFindReservationIntervals {
  constructor (
    private readonly findServiceHoursRepository: FindServiceHoursRepository
  ) {}

  async find (date: Date, companyId): Promise<ReservationInterval[]> {
    await this.findServiceHoursRepository.findBy({ companyId, weekday: date.getDay() })

    return await new Promise(resolve => { resolve([{ start: new Date(), end: new Date() }]) })
  }
}
