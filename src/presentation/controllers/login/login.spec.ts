import { Authentication } from '../../../domain/usecases/authentication'
import { MissingParamError } from '../../errors'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/httpHelper'
import { Validation, HttpRequest } from '../signup/signup.protocols'
import { LoginController } from './login'

const makeFakeRequest = (): HttpRequest => {
  return ({
    body: {
      email: 'any_email@mail.com',
      password: 'any_password'
    }
  })
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authenticationModel: any): Promise<string> {
      return await new Promise(resolve => { resolve('any_token') })
    }
  }

  return new AuthenticationStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }

  return new ValidationStub()
}

interface SutTypes {
  sut: LoginController
  validationStub: Validation
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const authenticationStub = makeAuthentication()
  const sut = new LoginController(authenticationStub, validationStub)

  return {
    sut,
    validationStub,
    authenticationStub
  }
}

describe('Login Controller', () => {
  it('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()

    const authSpy = jest.spyOn(authenticationStub, 'auth')

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(authSpy).toHaveBeenCalledWith({
      ...httpRequest.body
    })
  })

  it('should returns 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()

    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(async () => await new Promise(resolve => { resolve('') }))

    const httpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(unauthorized())
  })

  it('should returns 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()

    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(
      new Promise((resolve, reject) => { reject(new Error()) })
    )

    const httpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('should returns 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()

    const httpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(ok({
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
})
