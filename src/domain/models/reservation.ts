import { AccountModel } from './account'
import { Company } from './company'
import { ReservationStatus } from './reservation-status'

export type Reservation = {
  id: string
  price: number
  status: ReservationStatus
  date: Date
  startTime: string
  endTime: string
  description: string | null
  accountId: string
  account?: AccountModel
  companyId: string
  company?: Company
  createdAt: Date
  updatedAt: Date
}
