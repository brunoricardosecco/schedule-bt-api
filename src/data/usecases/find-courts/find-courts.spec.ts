
import { FindCourtsRepository, Court } from './find-courts.protocols'
import { FindCourts } from './find-courts'

const makeFindCourtsRepository = (): FindCourtsRepository => {
  class FindCourtsRepositoryStub implements FindCourtsRepository {
    async findMany (): Promise<Court[]> {
      return await new Promise(resolve => { resolve([]) })
    }
  }

  return new FindCourtsRepositoryStub()
}

type SutTypes = {
  sut: FindCourts
  findManyCourtsRepositoryStub: FindCourtsRepository
}

const makeSut = (): SutTypes => {
  const findManyCourtsRepositoryStub = makeFindCourtsRepository()
  const sut = new FindCourts(findManyCourtsRepositoryStub)

  return {
    sut,
    findManyCourtsRepositoryStub
  }
}

describe('FindCourts Usecase', () => {
  it('should find all user courts', async () => {
    const { sut, findManyCourtsRepositoryStub } = makeSut()
    const companyId = 'ID'

    const courts = [
      {
        id: '1',
        name: 'Quadra 1',
        company: null,
        companyId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Quadra 2',
        company: null,
        companyId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    const findManySpy = jest.spyOn(findManyCourtsRepositoryStub, 'findMany')

    findManySpy.mockResolvedValue(courts)

    const response = await sut.findMany({ companyId })

    expect(findManySpy).toHaveBeenCalledWith({
      companyId
    })
    expect(response).toStrictEqual(courts)
  })
})
