import { IUpdateAccountPassword, UpdateAccountPasswordReturn, AccountModel, RoleEnum } from './update-account-password.protocols'
import { MissingParamError } from '@/presentation/errors'
import { badRequest, ok, serverError } from '@/presentation/helpers/http/httpHelper'
import { Validation, HttpRequest } from '@/presentation/controllers/signup/signup-controller.protocols'
import { UpdateAccountPasswordController } from './update-account-password-controller'

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
  updatedAt: new Date()
})

const makeFakeRequest = (body: Record<string, any>): HttpRequest => {
  return ({
    user: makeFakeAccount(),
    body
  })
}

const makeUpdateAccountPassword = (): IUpdateAccountPassword => {
  class UpdateAccountPasswordStub implements IUpdateAccountPassword {
    async update (): UpdateAccountPasswordReturn {
      return makeFakeAccount()
    }
  }

  return new UpdateAccountPasswordStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (): Error | null {
      return null
    }
  }

  return new ValidationStub()
}

type SutTypes = {
  sut: UpdateAccountPasswordController
  validationStub: Validation
  updateAccountPasswordStub: IUpdateAccountPassword
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const updateAccountPasswordStub = makeUpdateAccountPassword()
  const sut = new UpdateAccountPasswordController(updateAccountPasswordStub, validationStub)

  return {
    sut,
    validationStub,
    updateAccountPasswordStub
  }
}

describe('UpdateAccountPasswordController', () => {
  it('should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('password'))

    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  it('should returns 500 if UpdateAccountPassword throws', async () => {
    const { sut, updateAccountPasswordStub } = makeSut()

    jest.spyOn(updateAccountPasswordStub, 'update').mockRejectedValueOnce(new Error())

    const httpRequest = makeFakeRequest({ password: '' })

    const response = await sut.handle(httpRequest)

    expect(response).toEqual(serverError(new Error()))
  })

  it('should return 200 on success', async () => {
    const { sut, updateAccountPasswordStub } = makeSut()

    const httpRequest = makeFakeRequest({ password: 'validPassword123' })

    const accountUpdated = makeFakeAccount()

    const updateAccountPasswordSpy = jest.spyOn(updateAccountPasswordStub, 'update')
    updateAccountPasswordSpy.mockResolvedValueOnce(accountUpdated)

    const response = await sut.handle(httpRequest)

    expect(updateAccountPasswordSpy).toHaveBeenCalledWith(httpRequest.user?.id, httpRequest.body.password)
    expect(response).toEqual(ok({
      account: accountUpdated
    }))
  })
})
