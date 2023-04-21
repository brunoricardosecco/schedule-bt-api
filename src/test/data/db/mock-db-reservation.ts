import { FindReservationByIdAndCompanyIdRepository } from '@/data/protocols/db/reservation/find-reservation-by-id-and-company-id-repository'
import {
  UpdateReservationByIdParamsToRepository,
  UpdateReservationByIdRepository,
} from '@/data/protocols/db/reservation/update-reservation-by-id-repository'
import {
  FindReservationsRepository,
  FindReservationsRepositoryParams,
} from '@/data/usecases/find-reservation-slots/find-reservation-slots.protocols'
import { Reservation } from '@/domain/models/reservation'
import { mockReservation } from '@/test/domain/models/mock-reservation'

export const mockFindReservationsRepository = (): FindReservationsRepository => {
  class FindReservationRepositoryStub implements FindReservationsRepository {
    async findBy(params: FindReservationsRepositoryParams): Promise<Reservation[]> {
      return await Promise.resolve([])
    }
  }

  return new FindReservationRepositoryStub()
}

export const mockFindReservationByIdAndCompanyIdRepository = (): FindReservationByIdAndCompanyIdRepository => {
  class FindReservationByIdAndCompanyIdRepositoryStub implements FindReservationByIdAndCompanyIdRepository {
    async findByIdAndCompanyId(reservationId: string, companyId: string): Promise<Reservation> {
      return await Promise.resolve(mockReservation())
    }
  }

  return new FindReservationByIdAndCompanyIdRepositoryStub()
}

export const mockUpdateReservationByIdRepository = (): UpdateReservationByIdRepository => {
  class FindReservationByIdAndCompanyIdRepository implements UpdateReservationByIdRepository {
    async updateById({ id, data }: UpdateReservationByIdParamsToRepository): Promise<Reservation> {
      return await Promise.resolve(mockReservation())
    }
  }

  return new FindReservationByIdAndCompanyIdRepository()
}
