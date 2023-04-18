import { noContent, notFound, serverError } from '@/presentation/helpers/http/httpHelper'
import { mockAccount } from '@/test/domain/models/mock-account'
import { mockDeleteCourtById } from '@/test/domain/usecases/mock-delete-court-by-id'
import { mockRequest } from '@/test/presentation/mock-http'
import { DeleteCourtByIdController } from './delete-court-by-id-controller'
import { IDeleteCourtById, NotFoundError } from './delete-court-by-id.protocols'

type SutTypes = {
  sut: DeleteCourtByIdController
  deleteCourtByIdStub: IDeleteCourtById
}

const makeSut = (): SutTypes => {
  const deleteCourtByIdStub = mockDeleteCourtById()
  const sut = new DeleteCourtByIdController(deleteCourtByIdStub)

  return {
    sut,
    deleteCourtByIdStub,
  }
}

describe('DeleteCourtByIdController', () => {
  it('should returns 500 if DeleteCourtById throws', async () => {
    const { sut, deleteCourtByIdStub } = makeSut()
    jest.spyOn(deleteCourtByIdStub, 'deleteById').mockRejectedValueOnce(new Error())
    const httpRequest = mockRequest({ user: mockAccount(), params: { courtId: 'court_id' } })
    const response = await sut.handle(httpRequest)

    expect(response).toEqual(serverError(new Error()))
  })

  it('should call DeleteCourtById with correct values', async () => {
    const { sut, deleteCourtByIdStub } = makeSut()
    const deleteByIdSpy = jest.spyOn(deleteCourtByIdStub, 'deleteById')
    const httpRequest = mockRequest({ user: mockAccount(), params: { courtId: 'any_court_id' } })
    await sut.handle(httpRequest)

    expect(deleteByIdSpy).toHaveBeenCalledWith('any_court_id', 'any_company_id')
  })

  it('should return 404 if court_id not exists', async () => {
    const { sut, deleteCourtByIdStub } = makeSut()
    const httpRequest = mockRequest({ user: mockAccount(), params: { courtId: 'court_id' } })
    jest.spyOn(deleteCourtByIdStub, 'deleteById').mockResolvedValueOnce(new NotFoundError('Quadra não encontrada'))
    const response = await sut.handle(httpRequest)

    expect(response).toStrictEqual(notFound('Quadra não encontrada'))
  })

  it('should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpRequest = mockRequest({ user: mockAccount(), params: { courtId: 'court_id' } })
    const response = await sut.handle(httpRequest)

    expect(response).toStrictEqual(noContent())
  })
})
