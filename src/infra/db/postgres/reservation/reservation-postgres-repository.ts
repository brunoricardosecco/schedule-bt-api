import { FindReservationsRepository, FindReservationsRepositoryParams } from '@/data/protocols/db/reservation/find-reservation-repository'
import { Reservation } from '@/domain/models/reservation'
import { db } from '../../orm/prisma'

export class ReservationPostgresRepository implements FindReservationsRepository {
  async findBy (params: FindReservationsRepositoryParams): Promise<Reservation[]> {
    return await db.reservations.findMany({
      where: {
        companyId: params.companyId,
        reservationStartDateTime: {
          gte: params.startAt,
          lte: params.endAt
        }
      }
    })
  }
}
