import { CreateCourtsReturn, ICreateCourts } from '@/domain/usecases/create-courts'

export const mockCreateCourts = (): ICreateCourts => {
  class CreateCourtsStub implements ICreateCourts {
    async create(): CreateCourtsReturn {
      return await Promise.resolve(2)
    }
  }

  return new CreateCourtsStub()
}
