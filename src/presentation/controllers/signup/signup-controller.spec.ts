import { MissingParamError, ServerError } from '@/presentation/errors'
import { AccountModel, AddAccount, AddAccountModel, HttpRequest, Validation, IAuthenticateByPassword } from './signup-controller.protocols'
import { SignUpController } from './signup-controller'
import { badRequest, ok, serverError } from '@/presentation/helpers/http/httpHelper'
import { RoleEnum } from '@/domain/enums/role-enum'

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  hashedPassword: 'valid_password',
  role: RoleEnum.CLIENT,
  companyId: null,
  company: null,
  emailValidationToken: null,
  emailValidationTokenExpiration: null,
  isConfirmed: false,
  createdAt: new Date(),
  updatedAt: new Date()
})

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      companyId: 'any_company_id',
      role: RoleEnum.EMPLOYEE
    }
  }
}

const makeAuthenticate = (): IAuthenticateByPassword => {
  class AuthenticateStub implements IAuthenticateByPassword {
    async auth (): Promise<string> {
      return await new Promise(resolve => { resolve('any_token') })
    }
  }

  return new AuthenticateStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await new Promise(resolve => { resolve(makeFakeAccount()) })
    }
  }

  return new AddAccountStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }

  return new ValidationStub()
}

type SutTypes = {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
  authenticateStub: IAuthenticateByPassword
}

const makeSut = (): SutTypes => {
  const authenticateStub = makeAuthenticate()
  const validationStub = makeValidation()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(addAccountStub, validationStub, authenticateStub)
  return {
    sut,
    addAccountStub,
    validationStub,
    authenticateStub
  }
}

describe('SignUp Controller', () => {
  it('should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()

    const addSpy = jest.spyOn(addAccountStub, 'add')

    await sut.handle(makeFakeRequest())

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      companyId: 'any_company_id',
      role: RoleEnum.EMPLOYEE
    })
  })

  it('should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => { return await new Promise((resolve, reject) => { reject(new Error()) }) })

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  it('should return 200 if a valid data is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(ok({
      account: makeFakeAccount(),
      accessToken: 'any_token'
    }))
  })

  it('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()

    const validateSpy = jest.spyOn(validationStub, 'validate')

    const httpRequest = makeFakeRequest()

    await sut.handle(makeFakeRequest())

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  it('should call Authenticate with correct values', async () => {
    const { sut, authenticateStub } = makeSut()

    const authSpy = jest.spyOn(authenticateStub, 'auth')

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(authSpy).toHaveBeenCalledWith({
      email: httpRequest.body.email,
      password: httpRequest.body.password
    })
  })

  it('should returns 500 if Authenticate throws', async () => {
    const { sut, authenticateStub } = makeSut()

    jest.spyOn(authenticateStub, 'auth').mockReturnValueOnce(
      new Promise((resolve, reject) => { reject(new Error()) })
    )

    const httpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
