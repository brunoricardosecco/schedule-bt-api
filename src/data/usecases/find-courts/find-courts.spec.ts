import { mockFindCourtsRepository } from '@/test/data/db/mock-db-court'
import { mockCourt } from '@/test/domain/models/mock-court'
import { FindCourts } from './find-courts'
import { FindCourtsRepository } from './find-courts.protocols'

type SutTypes = {
  sut: FindCourts
  findManyCourtsRepositoryStub: FindCourtsRepository
}

const makeSut = (): SutTypes => {
  const findManyCourtsRepositoryStub = mockFindCourtsRepository()
  const sut = new FindCourts(findManyCourtsRepositoryStub)

  return {
    sut,
    findManyCourtsRepositoryStub,
  }
}

describe('FindCourts Usecase', () => {
  it('should find all user courts', async () => {
    const { sut, findManyCourtsRepositoryStub } = makeSut()
    const companyId = 'ID'
    const courts = [mockCourt(), mockCourt()]
    const findManySpy = jest.spyOn(findManyCourtsRepositoryStub, 'findMany').mockResolvedValue(courts)
    const response = await sut.findMany({ companyId })

    expect(findManySpy).toHaveBeenCalledWith({ companyId })
    expect(response).toStrictEqual(courts)
  })
})
