import { ReservationStatusEnum } from '@/domain/enums/reservation-status-enum'
import { Reservation } from '@/domain/models/reservation'

export const mockeReservation = (reservationValues?: Partial<Reservation>): Reservation => ({
  id: 'any_id',
  accountId: 'account_id',
  companyId: 'company_id',
  description: '',
  date: new Date(),
  startTime: '10:00',
  endTime: '11:00',
  price: 0,
  status: ReservationStatusEnum.AWAITING_PAYMENT,
  createdAt: new Date('1970-01-01T00:00:00.000Z'),
  updatedAt: new Date('1970-01-01T00:00:00.000Z'),
  ...reservationValues,
})
