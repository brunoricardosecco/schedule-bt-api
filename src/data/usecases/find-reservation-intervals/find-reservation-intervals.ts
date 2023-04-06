import { FindCompaniesRepository, ReservationInterval, FindReservationIntervalsParams, IFindReservationIntervals, FindServiceHoursRepository, FindReservationsRepository, getServiceHourTimeFormatted, TimeConflictChecker } from './find-reservation-intervals.protocols'

export class FindReservationIntervals implements IFindReservationIntervals {
  constructor (
    private readonly findServiceHoursRepository: FindServiceHoursRepository,
    private readonly findCompaniesRepository: FindCompaniesRepository,
    private readonly findReservationsRepository: FindReservationsRepository,
    private readonly timeConflictsChecker: TimeConflictChecker
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
      const { start, end } = getServiceHourTimeFormatted(serviceHour)

      const serviceHourIntervals = this.getIntervals(start, end, company.reservationTimeInMinutes)

      serviceHourIntervals.forEach(serviceHourInterval => intervals.push(serviceHourInterval))
    })

    const checkedIntervals = intervals.map(interval => {
      let isOverlapping = false
      reservations.forEach(reservation => {
        const formattedReservation = {
          start: reservation.reservationStartDateTime,
          end: reservation.reservationEndDateTime
        }
        if (this.timeConflictsChecker.areIntervalsOverlapping({ firstTime: formattedReservation, secondTime: interval })) {
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
