
import { CreateCourtsRepository } from './create-courts.protocols'
import { CreateCourts } from './create-courts'

const makeCreateCourtsRepository = (): CreateCourtsRepository => {
  class CreateCourtsRepositoryStub implements CreateCourtsRepository {
    async createMany (): Promise<number> {
      return await new Promise(resolve => { resolve(1) })
    }
  }

  return new CreateCourtsRepositoryStub()
}

type SutTypes = {
  sut: CreateCourts
  createCourtsRepositoryStub: CreateCourtsRepository
}

const makeSut = (): SutTypes => {
  const createCourtsRepositoryStub = makeCreateCourtsRepository()
  const sut = new CreateCourts(createCourtsRepositoryStub)

  return {
    sut,
    createCourtsRepositoryStub
  }
}

describe('CreateCourts Usecase', () => {
  it('should create courts', async () => {
    const { sut, createCourtsRepositoryStub } = makeSut()

    const companyId = 'company_id'
    const courts = [{ name: 'Quadra 1' }]

    const createManySpy = jest.spyOn(createCourtsRepositoryStub, 'createMany')

    const response = await sut.create(companyId, courts)

    expect(createManySpy).toHaveBeenCalledWith([
      {
        name: courts[0].name,
        companyId
      }
    ])
    expect(response).toBe(courts.length)
  })
})
