import { IAuthenticateByPassword } from '@/domain/usecases/authenticate-by-password'
import { HttpRequest, Validation } from '@/presentation/controllers/signup/signup-controller.protocols'
import { MissingParamError } from '@/presentation/errors'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/http/httpHelper'
import { AuthenticateByPasswordController } from './authenticate-by-password-controller'

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      email: 'any_email@mail.com',
      password: 'any_password',
    },
  }
}

const makeAuthenticate = (): IAuthenticateByPassword => {
  class AuthenticateStub implements IAuthenticateByPassword {
    async auth(): Promise<string> {
      return await new Promise(resolve => {
        resolve('any_token')
      })
    }
  }

  return new AuthenticateStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error | null {
      return null
    }
  }

  return new ValidationStub()
}

type SutTypes = {
  sut: AuthenticateByPasswordController
  validationStub: Validation
  authenticateStub: IAuthenticateByPassword
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const authenticateStub = makeAuthenticate()
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

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(authSpy).toHaveBeenCalledWith({
      ...httpRequest.body,
    })
  })

  it('should returns 401 if invalid credentials are provided', async () => {
    const { sut, authenticateStub } = makeSut()

    jest.spyOn(authenticateStub, 'auth').mockImplementationOnce(
      async () =>
        await new Promise(resolve => {
          resolve('')
        })
    )

    const httpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(unauthorized())
  })

  it('should returns 500 if Authenticate throws', async () => {
    const { sut, authenticateStub } = makeSut()

    jest.spyOn(authenticateStub, 'auth').mockReturnValueOnce(
      new Promise((resolve, reject) => {
        reject(new Error())
      })
    )

    const httpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('should returns 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()

    const httpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(
      ok({
        accessToken: 'any_token',
      })
    )
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
