import { FindCourtsReturn, IFindCourts } from '@/domain/usecases/find-courts'

export const mockFindCourts = (): IFindCourts => {
  class FindCourtsStub implements IFindCourts {
    async findMany(): FindCourtsReturn {
      return await Promise.resolve([])
    }
  }

  return new FindCourtsStub()
}
