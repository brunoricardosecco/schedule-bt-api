import { ReservationStatusEnum } from '@/domain/enums/reservation-status-enum'

export type ReservationStatus = keyof typeof ReservationStatusEnum
