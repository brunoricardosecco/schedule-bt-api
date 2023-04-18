import { notFound, ok, serverError } from '@/presentation/helpers/http/httpHelper'
import { mockAccount } from '@/test/domain/models/mock-account'
import { mockUpdateCourtById } from '@/test/domain/usecases/mock-update-court-by-id'
import { mockRequest } from '@/test/presentation/mock-http'
import { UpdateCourtByIdController } from './update-court-by-id-controller'
import { IUpdateCourtById, NotFoundError } from './update-court-by-id.protocols'

type SutTypes = {
  sut: UpdateCourtByIdController
  updateCourtByIdStub: IUpdateCourtById
}

const makeSut = (): SutTypes => {
  const updateCourtByIdStub = mockUpdateCourtById()
  const sut = new UpdateCourtByIdController(updateCourtByIdStub)

  return {
    sut,
    updateCourtByIdStub,
  }
}

describe('UpdateeCourtByIdController', () => {
  it('should returns 500 if UpdateCourtById throws', async () => {
    const { sut, updateCourtByIdStub } = makeSut()
    jest.spyOn(updateCourtByIdStub, 'updateById').mockRejectedValueOnce(new Error())
    const httpRequest = mockRequest({ user: mockAccount(), body: { name: 'any_name' } })
    const response = await sut.handle(httpRequest)

    expect(response).toEqual(serverError(new Error()))
  })

  it('should call UpdateCourtById with correct values', async () => {
    const { sut, updateCourtByIdStub } = makeSut()
    const updateByIdSpy = jest.spyOn(updateCourtByIdStub, 'updateById')
    const httpRequest = mockRequest({
      user: mockAccount(),
      params: { courtId: 'any_court_id' },
      body: { name: 'any_name' },
    })
    await sut.handle(httpRequest)

    expect(updateByIdSpy).toHaveBeenCalledWith({
      id: 'any_court_id',
      companyId: 'any_company_id',
      data: { name: 'any_name' },
    })
  })

  it('should return 404 if court_id not exists', async () => {
    const { sut, updateCourtByIdStub } = makeSut()
    const httpRequest = mockRequest({
      user: mockAccount(),
      params: { courtId: 'any_court_id' },
      body: { name: 'any_name' },
    })
    jest
      .spyOn(updateCourtByIdStub, 'updateById')
      .mockReturnValueOnce(Promise.resolve(new NotFoundError('Quadra não encontrada')))
    const response = await sut.handle(httpRequest)

    expect(response).toStrictEqual(notFound('Quadra não encontrada'))
  })

  it('should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpRequest = mockRequest({
      user: mockAccount(),
      params: { courtId: 'any_court_id' },
      body: { name: 'any_name' },
    })
    const response = await sut.handle(httpRequest)

    expect(response).toStrictEqual(
      ok({
        id: 'any_id',
        name: 'any_name',
        companyId: 'any_id',
        createdAt: new Date('1970-01-01T00:00:00.000Z'),
        updatedAt: new Date('1970-01-01T00:00:00.000Z'),
      })
    )
  })
})
