import { ReservationInterval } from '../models/reservation-interval'

export interface IFindReservationIntervals {
  find: (date: Date, companyId: string) => Promise<ReservationInterval[]>
}
