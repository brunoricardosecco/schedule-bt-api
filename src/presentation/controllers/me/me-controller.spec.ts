import { mockAccount } from '@/test/domain/models/mock-account'
import { mockFindAccountById } from '@/test/domain/usecases/mock-find-account-by-id'
import { mockRequest } from '@/test/presentation/mock-http'
import { MeController } from './me-controller'
import { IFindAccountById, ok, serverError } from './me-controller.protocols'

type SutTypes = {
  sut: MeController
  findAccountByIdStub: IFindAccountById
}

const makeSut = (): SutTypes => {
  const findAccountByIdStub = mockFindAccountById()
  const sut = new MeController(findAccountByIdStub)

  return {
    findAccountByIdStub,
    sut,
  }
}

describe('Me Controller', () => {
  it('should call FindAccountById with correct values', async () => {
    const { sut, findAccountByIdStub } = makeSut()
    const findByIdSpy = jest.spyOn(findAccountByIdStub, 'findById')
    const httpRequest = mockRequest({ user: mockAccount() })
    await sut.handle(httpRequest)

    expect(findByIdSpy).toHaveBeenCalledWith('any_id')
  })

  it('should returns 500 if FindAccountById throws', async () => {
    const { sut, findAccountByIdStub } = makeSut()
    jest.spyOn(findAccountByIdStub, 'findById').mockRejectedValueOnce(new Error())
    const httpRequest = mockRequest({ user: mockAccount() })
    const response = await sut.handle(httpRequest)

    expect(response).toEqual(serverError(new Error()))
  })

  it('should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpRequest = mockRequest({ user: mockAccount() })
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(ok(mockAccount()))
  })
})
