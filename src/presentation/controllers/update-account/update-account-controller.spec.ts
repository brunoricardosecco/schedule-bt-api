import { badRequest, ok, serverError } from '@/presentation/helpers/http/httpHelper'
import { mockAccount } from '@/test/domain/models/mock-account'
import { mockUpdateAccount } from '@/test/domain/usecases/mock-update-account'
import { mockRequest } from '@/test/presentation/mock-http'
import { UpdateAccountController } from './update-account-controller'
import { IUpdateAccount } from './update-account.protocols'

type SutTypes = {
  sut: UpdateAccountController
  updateAccountStub: IUpdateAccount
}

const makeSut = (): SutTypes => {
  const updateAccountStub = mockUpdateAccount()
  const sut = new UpdateAccountController(updateAccountStub)

  return {
    sut,
    updateAccountStub,
  }
}

describe('UpdateAccountController', () => {
  it('should returns 500 if UpdateAccount throws', async () => {
    const { sut, updateAccountStub } = makeSut()
    jest.spyOn(updateAccountStub, 'update').mockRejectedValueOnce(new Error())
    const httpRequest = mockRequest({ user: mockAccount(), body: { name: '', password: '' } })
    const response = await sut.handle(httpRequest)

    expect(response).toEqual(serverError(new Error()))
  })

  it('should returns 400 if UpdateAccount returns an Error', async () => {
    const { sut, updateAccountStub } = makeSut()
    const error = new Error('Error')
    jest.spyOn(updateAccountStub, 'update').mockResolvedValueOnce(error)
    const httpRequest = mockRequest({ user: mockAccount(), body: { name: '', password: '' } })
    const response = await sut.handle(httpRequest)

    expect(response).toEqual(badRequest(error))
  })

  it('should return 200 on success', async () => {
    const { sut, updateAccountStub } = makeSut()
    const httpRequest = mockRequest({ user: mockAccount(), body: { name: 'New name', password: 'validPassword123' } })
    const accountUpdated = mockAccount()
    const updateAccountSpy = jest.spyOn(updateAccountStub, 'update').mockResolvedValueOnce(accountUpdated)
    const response = await sut.handle(httpRequest)

    expect(updateAccountSpy).toHaveBeenCalledWith(httpRequest.user?.id, httpRequest.body)
    expect(response).toEqual(ok({ account: accountUpdated }))
  })
})
