import { Court, CreateCourtsRepository } from '@/data/usecases/create-courts/create-courts.protocols'
import {
  DeleteCourtByIdRepository,
  FindCourtByIdAndCompanyIdRepository,
} from '@/data/usecases/delete-court-by-id/delete-court-by-id.protocols'
import { FindCourtsRepository } from '@/data/usecases/find-courts/find-courts.protocols'
import {
  UpdateCourtByIdParamsToRepository,
  UpdateCourtByIdRepository,
} from '@/data/usecases/update-court-by-id/update-court-by-id.protocols'
import { mockCourt } from '@/test/domain/models/mock-court'

export const mockCreateCourtsRepository = (): CreateCourtsRepository => {
  class CreateCourtsRepositoryStub implements CreateCourtsRepository {
    async createMany(): Promise<number> {
      return await Promise.resolve(1)
    }
  }

  return new CreateCourtsRepositoryStub()
}

export const mockDeleteCourtByIdRepository = (): DeleteCourtByIdRepository => {
  class DeleteCourtByIdRepositoryStub implements DeleteCourtByIdRepository {
    async deleteById(courtId: string): Promise<Court> {
      return await Promise.resolve(mockCourt())
    }
  }

  return new DeleteCourtByIdRepositoryStub()
}

export const mockFindCourtByIdAndCompanyIdRepository = (): FindCourtByIdAndCompanyIdRepository => {
  class FindCourtByIdAndCompanyIdRepositoryStub implements FindCourtByIdAndCompanyIdRepository {
    async findByIdAndCompanyId(courtId: string, companyId: string): Promise<Court | null> {
      return await Promise.resolve(mockCourt())
    }
  }

  return new FindCourtByIdAndCompanyIdRepositoryStub()
}

export const mockFindCourtsRepository = (): FindCourtsRepository => {
  class FindCourtsRepositoryStub implements FindCourtsRepository {
    async findMany(): Promise<Court[]> {
      return await Promise.resolve([])
    }
  }

  return new FindCourtsRepositoryStub()
}

export const mockUpdateCourtByIdRepository = (): UpdateCourtByIdRepository => {
  class UpdateCourtByIdRepositoryStub implements UpdateCourtByIdRepository {
    async updateById({ id, data }: UpdateCourtByIdParamsToRepository): Promise<Court> {
      const fakeCourt = mockCourt()
      return await Promise.resolve(fakeCourt)
    }
  }

  return new UpdateCourtByIdRepositoryStub()
}
