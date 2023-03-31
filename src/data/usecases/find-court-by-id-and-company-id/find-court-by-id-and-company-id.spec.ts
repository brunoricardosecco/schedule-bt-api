
import { FindCourtByIdAndCompanyId } from './find-court-by-id-and-company-id'
import { Court, FindCourtByIdAndCompanyIdRepository } from './find-court-by-id-and-company-id.protocols'

const mockCourt = (): Court => ({
  id: 'any_id',
  companyId: 'any_id',
  name: 'any_name',
  createdAt: new Date(),
  updatedAt: new Date()
})

const makeFindCourtByIdAndCompanyIdRepository = (): FindCourtByIdAndCompanyIdRepository => {
  class FindCourtByIdAndCompanyIdRepositoryStub implements FindCourtByIdAndCompanyIdRepository {
    async findByIdAndCompanyId (courtId: string, companyId: string): Promise<Court | null> {
      const fakeCourt = mockCourt()
      return await Promise.resolve(fakeCourt)
    }
  }

  return new FindCourtByIdAndCompanyIdRepositoryStub()
}

type SutTypes = {
  sut: FindCourtByIdAndCompanyId
  findCourtByIdAndCompanyIdRepositoryStub: FindCourtByIdAndCompanyIdRepository
}

const makeSut = (): SutTypes => {
  const findCourtByIdAndCompanyIdRepositoryStub = makeFindCourtByIdAndCompanyIdRepository()
  const sut = new FindCourtByIdAndCompanyId(findCourtByIdAndCompanyIdRepositoryStub)

  return {
    sut,
    findCourtByIdAndCompanyIdRepositoryStub
  }
}

describe('DbFindCourtByIdAndCompanyId Usecase', () => {
  it('should call FindCourtByIdAndCompanyIdRepository', async () => {
    const { sut, findCourtByIdAndCompanyIdRepositoryStub } = makeSut()
    const findByIdAndCompanyIdSpy = jest.spyOn(findCourtByIdAndCompanyIdRepositoryStub, 'findByIdAndCompanyId')
    await sut.findByIdAndCompanyId('any_id', 'any_company_id')

    expect(findByIdAndCompanyIdSpy).toHaveBeenCalledWith('any_id', 'any_company_id')
  })

  it('should return a court on success', async () => {
    const { sut } = makeSut()
    const fakeCourt = mockCourt()
    const court = await sut.findByIdAndCompanyId('any_id', 'any_company_id')

    expect(court).toEqual(fakeCourt)
  })

  it('should throw an exception if LoadSurveyByIdRepository throws an expection', async () => {
    const { sut, findCourtByIdAndCompanyIdRepositoryStub } = makeSut()
    jest.spyOn(findCourtByIdAndCompanyIdRepositoryStub, 'findByIdAndCompanyId').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.findByIdAndCompanyId('any_id', 'any_company_id')

    await expect(promise).rejects.toThrow()
  })
})
