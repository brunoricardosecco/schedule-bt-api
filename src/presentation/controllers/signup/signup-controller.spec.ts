import { RoleEnum } from '@/domain/enums/role-enum'
import { MissingParamError, ServerError } from '@/presentation/errors'
import { badRequest, ok, serverError } from '@/presentation/helpers/http/httpHelper'
import { mockAccount } from '@/test/domain/models/mock-account'
import { mockAddAccount } from '@/test/domain/usecases/mock-add-account'
import { mockAuthenticateByPassword } from '@/test/domain/usecases/mock-authenticate-by-password'
import { mockRequest } from '@/test/presentation/mock-http'
import { mockValidation } from '@/test/validation/mock-validation'
import { SignUpController } from './signup-controller'
import { AddAccount, IAuthenticateByPassword, Validation } from './signup-controller.protocols'

type SutTypes = {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
  authenticateStub: IAuthenticateByPassword
}

const makeSut = (): SutTypes => {
  const authenticateStub = mockAuthenticateByPassword()
  const validationStub = mockValidation()
  const addAccountStub = mockAddAccount()
  const sut = new SignUpController(addAccountStub, validationStub, authenticateStub)
  return {
    sut,
    addAccountStub,
    validationStub,
    authenticateStub,
  }
}

describe('SignUp Controller', () => {
  it('should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(mockRequest())

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      companyId: 'any_company_id',
      role: RoleEnum.EMPLOYEE,
    })
  })

  it('should return 400 if AddAccount returns an error', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockResolvedValueOnce(new Error('Erro'))
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(badRequest(new Error('Erro')))
  })

  it('should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  it('should return 200 if a valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(ok({ account: mockAccount(), accessToken: 'any_token' }))
  })

  it('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  it('should call Authenticate with correct values', async () => {
    const { sut, authenticateStub } = makeSut()
    const authSpy = jest.spyOn(authenticateStub, 'auth')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)

    expect(authSpy).toHaveBeenCalledWith({ email: httpRequest.body.email, password: httpRequest.body.password })
  })

  it('should returns 500 if Authenticate throws', async () => {
    const { sut, authenticateStub } = makeSut()
    jest.spyOn(authenticateStub, 'auth').mockRejectedValueOnce(new Error())
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
