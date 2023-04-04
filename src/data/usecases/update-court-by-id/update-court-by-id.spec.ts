
import { UpdateCourtById } from './update-court-by-id'
import { Court, FindCourtByIdAndCompanyIdRepository, NotFoundError, UpdateCourtByIdParamsToRepository, UpdateCourtByIdRepository } from './update-court-by-id.protocols'

const mockCourt = (): Court => ({
  id: 'any_id',
  companyId: 'any_id',
  name: 'any_name',
  createdAt: new Date(),
  updatedAt: new Date()
})

const makeUpdateCourtByIdRepository = (): UpdateCourtByIdRepository => {
  class UpdateCourtByIdRepositoryStub implements UpdateCourtByIdRepository {
    async updateById ({ id, data }: UpdateCourtByIdParamsToRepository): Promise<Court> {
      const fakeCourt = mockCourt()
      return await Promise.resolve(fakeCourt)
    }
  }

  return new UpdateCourtByIdRepositoryStub()
}

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
  sut: UpdateCourtById
  updateCourtByIdRepositoryStub: UpdateCourtByIdRepository
  findCourtByIdAndCompanyIdRepositoryStub: FindCourtByIdAndCompanyIdRepository
}

const makeSut = (): SutTypes => {
  const updateCourtByIdRepositoryStub = makeUpdateCourtByIdRepository()
  const findCourtByIdAndCompanyIdRepositoryStub = makeFindCourtByIdAndCompanyIdRepository()
  const sut = new UpdateCourtById(updateCourtByIdRepositoryStub, findCourtByIdAndCompanyIdRepositoryStub)

  return {
    sut,
    updateCourtByIdRepositoryStub,
    findCourtByIdAndCompanyIdRepositoryStub
  }
}

describe('DbUpdateCourtById Usecase', () => {
  it('should call UpdateCourtByIdRepository with correct values', async () => {
    const { sut, updateCourtByIdRepositoryStub } = makeSut()
    const updateByIdSpy = jest.spyOn(updateCourtByIdRepositoryStub, 'updateById')
    await sut.updateById({ id: 'any_id', companyId: 'any_company_id', data: { name: 'any_name' } })

    expect(updateByIdSpy).toHaveBeenCalledWith({ id: 'any_id', data: { name: 'any_name' } })
  })

  it('should call FindCourtByIdAndCompanyIdRepository with correct values', async () => {
    const { sut, findCourtByIdAndCompanyIdRepositoryStub } = makeSut()
    const findByIdAndCompanyIdSpy = jest.spyOn(findCourtByIdAndCompanyIdRepositoryStub, 'findByIdAndCompanyId')
    await sut.updateById({ id: 'any_id', companyId: 'any_company_id', data: { name: 'any_name' } })

    expect(findByIdAndCompanyIdSpy).toHaveBeenCalledWith('any_id', 'any_company_id')
  })

  it('should throw an exception if UpdateCourtByIdRepository throws an expection', async () => {
    const { sut, updateCourtByIdRepositoryStub } = makeSut()
    jest.spyOn(updateCourtByIdRepositoryStub, 'updateById').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.updateById({ id: 'any_id', companyId: 'any_company_id', data: { name: 'any_name' } })

    await expect(promise).rejects.toThrow()
  })

  it('should throw an exception if FindCourtByIdAndCompanyIdRepository throws an expection', async () => {
    const { sut, findCourtByIdAndCompanyIdRepositoryStub } = makeSut()
    jest.spyOn(findCourtByIdAndCompanyIdRepositoryStub, 'findByIdAndCompanyId').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.updateById({ id: 'any_id', companyId: 'any_company_id', data: { name: 'any_name' } })

    await expect(promise).rejects.toThrow()
  })

  it('should return NotFoundError if FindCourtByIdAndCompanyIdRepository returns null', async () => {
    const { sut, findCourtByIdAndCompanyIdRepositoryStub } = makeSut()
    jest.spyOn(findCourtByIdAndCompanyIdRepositoryStub, 'findByIdAndCompanyId').mockReturnValueOnce(Promise.resolve(null))
    const error = await sut.updateById({ id: 'invalid_id', companyId: 'any_company_id', data: { name: 'any_name' } })

    expect(error).toEqual(new NotFoundError('Quadra não encontrada'))
  })

  it('should return a court on success', async () => {
    const { sut } = makeSut()
    const fakeCourt = mockCourt()
    const court = await sut.updateById({ id: 'any_id', companyId: 'any_company_id', data: { name: 'any_name' } })

    expect(court).toEqual(fakeCourt)
  })
})
