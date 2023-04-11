import {
  FindCompaniesRepository,
  FindReservationSlotsParams,
  FindReservationsRepository,
  FindServiceHoursRepository,
  getServiceHourTimeFormatted,
  IFindReservationSlots,
  ReservationSlot,
  TimeConflictChecker,
  UnformattedReservationSlot,
} from './find-reservation-slots.protocols'

export class FindReservationSlots implements IFindReservationSlots {
  constructor(
    private readonly findServiceHoursRepository: FindServiceHoursRepository,
    private readonly findCompaniesRepository: FindCompaniesRepository,
    private readonly findReservationsRepository: FindReservationsRepository,
    private readonly timeConflictsChecker: TimeConflictChecker
  ) {}

  async find({ date, companyId }: FindReservationSlotsParams): Promise<ReservationSlot[] | Error> {
    const serviceHours = await this.findServiceHoursRepository.findBy({ companyId, weekday: date.getDay() })

    if (serviceHours.length === 0) {
      return new Error('A empresa não possui horários de trabalhos cadastrados neste dia')
    }

    const [company] = await this.findCompaniesRepository.findBy({
      companyId,
    })

    if (!company) {
      return new Error('Erro ao buscar empresa')
    }

    const reservations = await this.findReservationsRepository.findBy({
      companyId,
      startAt: new Date(new Date(date.getTime()).setHours(0, 0, 0, 0)),
      endAt: new Date(new Date(date.getTime()).setHours(23, 59, 59, 999)),
    })

    let slots: UnformattedReservationSlot[] = []

    serviceHours.forEach(serviceHour => {
      const { start, end } = getServiceHourTimeFormatted(serviceHour)
      slots = this.getSlots(start, end, company.reservationTimeInMinutes)
    })

    const checkedSlots = slots.map(slot => {
      let isOverlapping = false
      reservations.forEach(reservation => {
        const formattedReservation = {
          start: reservation.reservationStartDateTime,
          end: reservation.reservationEndDateTime,
        }
        if (this.timeConflictsChecker.areIntervalsOverlapping({ firstTime: formattedReservation, secondTime: slot })) {
          isOverlapping = true
        }
      })

      return {
        ...slot,
        isAvailable: !isOverlapping,
      }
    })

    const formattedSlots = checkedSlots.map(slot => ({
      ...slot,
      start: slot.start.toISOString().substring(11, 16),
      end: slot.end.toISOString().substring(11, 16),
    }))

    return formattedSlots
  }

  private getSlots(start: Date, end: Date, intervalInMinutes: number): UnformattedReservationSlot[] {
    const slots: UnformattedReservationSlot[] = []
    let current = start
    let next = new Date(current.getTime() + intervalInMinutes * 60 * 1000)

    while (current < end) {
      slots.push({
        start: current,
        end: next,
        isAvailable: true,
      })
      current = next
      next = new Date(current.getTime() + intervalInMinutes * 60 * 1000)
    }

    return slots
  }
}
