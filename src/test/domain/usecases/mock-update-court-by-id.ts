import { Court } from '@/domain/models/court'
import { IUpdateCourtById } from '@/domain/usecases/update-court-by-id'
import { mockCourt } from '../models/mock-court'

export const mockUpdateCourtById = (): IUpdateCourtById => {
  class UpdateCourtByIdStub implements IUpdateCourtById {
    async updateById(): Promise<Court> {
      return await Promise.resolve(mockCourt())
    }
  }

  return new UpdateCourtByIdStub()
}
