import { IAuthenticateByPassword } from '@/domain/usecases/authenticate-by-password'
import { Validation } from '@/presentation/controllers/signup/signup-controller.protocols'
import { MissingParamError } from '@/presentation/errors'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/http/httpHelper'
import { mockAuthenticateByPassword } from '@/test/domain/usecases/mock-authenticate-by-password'
import { mockRequest } from '@/test/presentation/mock-http'
import { mockValidation } from '@/test/validation/mock-validation'
import { AuthenticateByPasswordController } from './authenticate-by-password-controller'

type SutTypes = {
  sut: AuthenticateByPasswordController
  validationStub: Validation
  authenticateStub: IAuthenticateByPassword
}

const makeSut = (): SutTypes => {
  const validationStub = mockValidation()
  const authenticateStub = mockAuthenticateByPassword()
  const sut = new AuthenticateByPasswordController(authenticateStub, validationStub)

  return {
    sut,
    validationStub,
    authenticateStub,
  }
}

describe('AuthenticateByPasswordController', () => {
  it('should call AuthenticateByPassword with correct values', async () => {
    const { sut, authenticateStub } = makeSut()
    const authSpy = jest.spyOn(authenticateStub, 'auth')
    const httpRequest = mockRequest({ body: { email: 'any_email', password: 'any_password' } })
    await sut.handle(httpRequest)

    expect(authSpy).toHaveBeenCalledWith({ ...httpRequest.body })
  })

  it('should return unauthorized error if invalid credentials are provided', async () => {
    const { sut, authenticateStub } = makeSut()
    jest.spyOn(authenticateStub, 'auth').mockResolvedValueOnce('')
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(unauthorized())
  })

  it('should throw error if Authenticate throws', async () => {
    const { sut, authenticateStub } = makeSut()
    jest.spyOn(authenticateStub, 'auth').mockRejectedValueOnce(new Error())
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('should authenticate the user', async () => {
    const { sut } = makeSut()
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })

  it('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('should return badRequest if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
