
import { DeleteCourtById } from './delete-court-by-id'
import { Court, DeleteCourtByIdRepository } from './delete-court-by-id.protocols'

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

type SutTypes = {
  sut: DeleteCourtById
  deleteCourtByIdRepositoryStub: DeleteCourtByIdRepository
}

const makeSut = (): SutTypes => {
  const deleteCourtByIdRepositoryStub = makeDeleteCourtByIdRepository()
  const sut = new DeleteCourtById(deleteCourtByIdRepositoryStub)

  return {
    sut,
    deleteCourtByIdRepositoryStub
  }
}

describe('DbFindCourtByIdAndCompanyId Usecase', () => {
  it('should call DeleteCourtByIdRepository', async () => {
    const { sut, deleteCourtByIdRepositoryStub } = makeSut()
    const deleteByIdSpy = jest.spyOn(deleteCourtByIdRepositoryStub, 'deleteById')
    await sut.deleteById('any_id')

    expect(deleteByIdSpy).toHaveBeenCalledWith('any_id')
  })

  it('should return a court on success', async () => {
    const { sut } = makeSut()
    const fakeCourt = mockCourt()
    const court = await sut.deleteById('any_id')

    expect(court).toEqual(fakeCourt)
  })

  it('should throw an exception if LoadSurveyByIdRepository throws an expection', async () => {
    const { sut, deleteCourtByIdRepositoryStub } = makeSut()
    jest.spyOn(deleteCourtByIdRepositoryStub, 'deleteById').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.deleteById('any_id')

    await expect(promise).rejects.toThrow()
  })
})
