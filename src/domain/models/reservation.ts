import { AccountModel } from './account'
import { Company } from './company'
import { ReservationStatus } from './reservation-status'

export type Reservation = {
  id: string
  reservationPrice: number
  reservationStatus: ReservationStatus
  reservationStartDateTime: Date
  reservationEndDateTime: Date
  description: string | null
  accountId: string
  account?: AccountModel
  companyId: string
  company?: Company
  createdAt: Date
  updatedAt: Date
}
