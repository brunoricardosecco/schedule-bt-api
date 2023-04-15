import { ReservationSlot } from '../models/reservation-slot'

export type FindReservationSlotsParams = {
  date: Date
  companyId: string
}

export interface IFindReservationSlots {
  find: ({ date, companyId }: FindReservationSlotsParams) => Promise<ReservationSlot[] | Error>
}
