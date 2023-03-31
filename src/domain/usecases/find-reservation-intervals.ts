import { ReservationInterval } from '../models/reservation-interval'

export type FindReservationIntervalsParams = {
  date: Date
  companyId: string
}

export interface IFindReservationIntervals {
  find: ({ date, companyId }: FindReservationIntervalsParams) => Promise<ReservationInterval[] | Error>
}
