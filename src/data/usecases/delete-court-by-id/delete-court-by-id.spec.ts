
import { NotFoundError } from '@/domain/errors/not-found-error'
import { DeleteCourtById } from './delete-court-by-id'
import { Court, DeleteCourtByIdRepository, FindCourtByIdAndCompanyIdRepository } from './delete-court-by-id.protocols'

const mockCourt = (): Court => ({
  id: 'any_id',
  companyId: 'any_id',
  name: 'any_name',
  createdAt: new Date(),
  updatedAt: new Date()
})

const makeDeleteCourtByIdRepository = (): DeleteCourtByIdRepository => {
  class DeleteCourtByIdRepositoryStub implements DeleteCourtByIdRepository {
    async deleteById (courtId: string): Promise<Court> {
      const fakeCourt = mockCourt()
      return await Promise.resolve(fakeCourt)
    }
  }

  return new DeleteCourtByIdRepositoryStub()
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
  sut: DeleteCourtById
  deleteCourtByIdRepositoryStub: DeleteCourtByIdRepository
  findCourtByIdAndCompanyIdRepositoryStub: FindCourtByIdAndCompanyIdRepository
}

const makeSut = (): SutTypes => {
  const deleteCourtByIdRepositoryStub = makeDeleteCourtByIdRepository()
  const findCourtByIdAndCompanyIdRepositoryStub = makeFindCourtByIdAndCompanyIdRepository()
  const sut = new DeleteCourtById(deleteCourtByIdRepositoryStub, findCourtByIdAndCompanyIdRepositoryStub)

  return {
    sut,
    deleteCourtByIdRepositoryStub,
    findCourtByIdAndCompanyIdRepositoryStub
  }
}

describe('DbFindCourtByIdAndCompanyId Usecase', () => {
  it('should call DeleteCourtByIdRepository with correct values', async () => {
    const { sut, deleteCourtByIdRepositoryStub } = makeSut()
    const deleteByIdSpy = jest.spyOn(deleteCourtByIdRepositoryStub, 'deleteById')
    await sut.deleteById('any_id', 'any_company_id')

    expect(deleteByIdSpy).toHaveBeenCalledWith('any_id')
  })

  it('should call FindCourtByIdAndCompanyIdRepository with correct values', async () => {
    const { sut, findCourtByIdAndCompanyIdRepositoryStub } = makeSut()
    const findByIdAndCompanyIdSpy = jest.spyOn(findCourtByIdAndCompanyIdRepositoryStub, 'findByIdAndCompanyId')
    await sut.deleteById('any_id', 'any_company_id')

    expect(findByIdAndCompanyIdSpy).toHaveBeenCalledWith('any_id', 'any_company_id')
  })

  it('should throw an exception if DeleteCourtByIdRepository throws an expection', async () => {
    const { sut, deleteCourtByIdRepositoryStub } = makeSut()
    jest.spyOn(deleteCourtByIdRepositoryStub, 'deleteById').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.deleteById('any_id', 'any_company_id')

    await expect(promise).rejects.toThrow()
  })

  it('should throw an exception if FindCourtByIdAndCompanyIdRepository throws an expection', async () => {
    const { sut, findCourtByIdAndCompanyIdRepositoryStub } = makeSut()
    jest.spyOn(findCourtByIdAndCompanyIdRepositoryStub, 'findByIdAndCompanyId').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.deleteById('any_id', 'any_company_id')

    await expect(promise).rejects.toThrow()
  })

  it('should return NotFoundError if FindCourtByIdAndCompanyIdRepository returns null', async () => {
    const { sut, findCourtByIdAndCompanyIdRepositoryStub } = makeSut()
    jest.spyOn(findCourtByIdAndCompanyIdRepositoryStub, 'findByIdAndCompanyId').mockReturnValueOnce(Promise.resolve(null))
    const error = await sut.deleteById('any_id', 'any_company_id')

    expect(error).toEqual(new NotFoundError('Quadra não encontrada'))
  })

  it('should return a court on success', async () => {
    const { sut } = makeSut()
    const fakeCourt = mockCourt()
    const court = await sut.deleteById('any_id', 'any_company_id')

    expect(court).toEqual(fakeCourt)
  })
})
