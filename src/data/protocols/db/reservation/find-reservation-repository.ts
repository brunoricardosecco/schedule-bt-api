import { Reservation } from '@/domain/models/reservation'

export type FindReservationsRepositoryParams = {
  companyId?: string
  startAt?: Date
  endAt?: Date
}

export interface FindReservationsRepository {
  findBy: (params: FindReservationsRepositoryParams) => Promise<Reservation[]>
}
