import { HttpRequest } from '@/presentation/controllers/signup/signup-controller.protocols'
import { badRequest, ok, serverError } from '@/presentation/helpers/http/httpHelper'
import { UpdateAccountController } from './update-account-controller'
import { AccountModel, IUpdateAccount, RoleEnum, UpdateAccountReturn } from './update-account.protocols'

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  hashedPassword: 'hashed_password',
  role: RoleEnum.COMPANY_ADMIN,
  companyId: 'company_id',
  company: null,
  emailValidationToken: null,
  emailValidationTokenExpiration: null,
  isConfirmed: false,
  createdAt: new Date(),
  updatedAt: new Date(),
})

const makeFakeRequest = (body: Record<string, any>): HttpRequest => {
  return {
    user: makeFakeAccount(),
    body,
  }
}

const makeUpdateAccount = (): IUpdateAccount => {
  class UpdateAccountStub implements IUpdateAccount {
    async update(): UpdateAccountReturn {
      return makeFakeAccount()
    }
  }

  return new UpdateAccountStub()
}

type SutTypes = {
  sut: UpdateAccountController
  updateAccountStub: IUpdateAccount
}

const makeSut = (): SutTypes => {
  const updateAccountStub = makeUpdateAccount()
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

    const httpRequest = makeFakeRequest({ name: '', password: '' })

    const response = await sut.handle(httpRequest)

    expect(response).toEqual(serverError(new Error()))
  })

  it('should returns 400 if UpdateAccount returns an Error', async () => {
    const { sut, updateAccountStub } = makeSut()

    const error = new Error('Error')

    jest.spyOn(updateAccountStub, 'update').mockResolvedValueOnce(error)

    const httpRequest = makeFakeRequest({ name: '', password: '' })

    const response = await sut.handle(httpRequest)

    expect(response).toEqual(badRequest(error))
  })

  it('should return 200 on success', async () => {
    const { sut, updateAccountStub } = makeSut()

    const httpRequest = makeFakeRequest({ name: 'New name', password: 'validPassword123' })

    const accountUpdated = makeFakeAccount()

    const updateAccountSpy = jest.spyOn(updateAccountStub, 'update')
    updateAccountSpy.mockResolvedValueOnce(accountUpdated)

    const response = await sut.handle(httpRequest)

    expect(updateAccountSpy).toHaveBeenCalledWith(httpRequest.user?.id, httpRequest.body)
    expect(response).toEqual(
      ok({
        account: accountUpdated,
      })
    )
  })
})
