import { mockCreateCourtsRepository } from '@/test/data/db/mock-db-court'
import { CreateCourts } from './create-courts'
import { CreateCourtsRepository } from './create-courts.protocols'

type SutTypes = {
  sut: CreateCourts
  createCourtsRepositoryStub: CreateCourtsRepository
}

const makeSut = (): SutTypes => {
  const createCourtsRepositoryStub = mockCreateCourtsRepository()
  const sut = new CreateCourts(createCourtsRepositoryStub)

  return {
    sut,
    createCourtsRepositoryStub,
  }
}

describe('CreateCourts Usecase', () => {
  it('should create courts', async () => {
    const { sut, createCourtsRepositoryStub } = makeSut()
    const companyId = 'any_company_id'
    const courts = [{ name: 'Quadra 1' }]
    const createManySpy = jest.spyOn(createCourtsRepositoryStub, 'createMany')
    const response = await sut.create(companyId, courts)

    expect(createManySpy).toHaveBeenCalledWith([{ name: courts[0].name, companyId }])
    expect(response).toBe(courts.length)
  })
})
