import { FindCompaniesRepository } from '@/data/protocols/db/company/find-company-repository'
import { ReservationInterval } from '@/domain/models/reservation-interval'
import { FindReservationIntervalsParams, IFindReservationIntervals } from '@/domain/usecases/find-reservation-intervals'
import { FindServiceHoursRepository } from '../find-service-hours/find-service-hours.protocols'
import { FindReservationsRepository } from '@/data/protocols/db/reservation/find-reservation-repository'
import { areIntervalsOverlapping } from 'date-fns'

export class FindReservationIntervals implements IFindReservationIntervals {
  constructor (
    private readonly findServiceHoursRepository: FindServiceHoursRepository,
    private readonly findCompaniesRepository: FindCompaniesRepository,
    private readonly findReservationsRepository: FindReservationsRepository
  ) {}

  async find ({ date, companyId }: FindReservationIntervalsParams): Promise<ReservationInterval[] | Error> {
    const serviceHours = await this.findServiceHoursRepository.findBy({ companyId, weekday: date.getDay() })

    if (serviceHours.length === 0) {
      return new Error('A empresa não possui horários de trabalhos cadastrados neste dia')
    }

    const [company] = await this.findCompaniesRepository.findBy({
      companyId
    })

    if (!company) {
      return new Error('Erro ao buscar empresa')
    }

    const reservations = await this.findReservationsRepository.findBy({
      companyId,
      startAt: new Date(date.setHours(0, 0, 0, 0)),
      endAt: new Date(date.setHours(23, 59, 59, 999))
    })

    const intervals: ReservationInterval[] = []

    serviceHours.forEach(serviceHour => {
      const splittedStartTime = serviceHour.startTime
        .split(':')
        .map((piece) => Number(piece))
      const splittedEndTime = serviceHour.endTime.split(':').map((piece) => Number(piece))
      const intervalStart = new Date(new Date().setHours(splittedStartTime[0], splittedStartTime[1], 0, 0))
      const intervalEnd = new Date(new Date().setHours(splittedEndTime[0], splittedEndTime[1], 0, 0))

      const serviceHourIntervals = this.getIntervals(intervalStart, intervalEnd, company.reservationTimeInMinutes)

      serviceHourIntervals.forEach(serviceHourInterval => intervals.push(serviceHourInterval))
    })

    const checkedIntervals = intervals.map(interval => {
      let isOverlapping = false
      reservations.forEach(reservation => {
        const formattedReservation = {
          start: reservation.reservationStartDateTime,
          end: reservation.reservationEndDateTime
        }
        if (areIntervalsOverlapping(interval, formattedReservation)) {
          isOverlapping = true
        }
      })

      return {
        ...interval,
        isAvailable: !isOverlapping
      }
    })

    return checkedIntervals
  }

  private getIntervals (start: Date, end: Date, intervalInMinutes: number): ReservationInterval[] {
    const intervals: ReservationInterval[] = []
    let current = new Date(start)
    let next = new Date(current.getTime() + intervalInMinutes * 60 * 1000)

    while (current < new Date(end)) {
      intervals.push({
        start: current,
        end: next,
        isAvailable: true
      })
      current = next
      next = new Date(current.getTime() + intervalInMinutes * 60 * 1000)
    }

    return intervals
  }
}
