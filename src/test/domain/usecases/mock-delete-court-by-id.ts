import { Court } from '@/domain/models/court'
import { IDeleteCourtById } from '@/domain/usecases/delete-court-by-id'
import { mockCourt } from '../models/mock-court'

export const mockDeleteCourtById = (): IDeleteCourtById => {
  class DeleteCourtByIdStub implements IDeleteCourtById {
    async deleteById(courtId: string): Promise<Court> {
      return await Promise.resolve(mockCourt())
    }
  }

  return new DeleteCourtByIdStub()
}
