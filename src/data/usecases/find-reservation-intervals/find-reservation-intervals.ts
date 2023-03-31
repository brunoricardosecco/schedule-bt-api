import { FindCompaniesRepository } from '@/data/protocols/db/company/find-company-repository'
import { ReservationInterval } from '@/domain/models/reservation-interval'
import { FindReservationIntervalsParams, IFindReservationIntervals } from '@/domain/usecases/find-reservation-intervals'
import { FindServiceHoursRepository } from '../find-service-hours/find-service-hours.protocols'

export class FindReservationIntervals implements IFindReservationIntervals {
  constructor (
    private readonly findServiceHoursRepository: FindServiceHoursRepository,
    private readonly findCompaniesRepository: FindCompaniesRepository
  ) {}

  async find ({ date, companyId }: FindReservationIntervalsParams): Promise<ReservationInterval[] | Error> {
    const serviceHours = await this.findServiceHoursRepository.findBy({ companyId, weekday: date.getDay() })

    if (serviceHours.length === 0) {
      return new Error('A empresa não possui horários de trabalhos cadastrados neste dia')
    }

    await this.findCompaniesRepository.findBy({
      companyId
    })

    return await new Promise(resolve => { resolve([{ start: new Date(), end: new Date() }]) })
  }
}
