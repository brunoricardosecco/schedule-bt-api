import { RoleEnum } from '@/domain/enums/role-enum'
import { AccountModel } from '@/domain/models/account'
import { IAuthenticate, IAuthenticateReturn } from '@/domain/usecases/authenticate'
import { AccessDeniedError, ServerError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/httpHelper'
import { AuthenticateMiddleware } from './authenticate-middleware'

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  hashedPassword: 'hashed_password',
  role: RoleEnum.EMPLOYEE,
  companyId: null,
  company: null,
  emailValidationToken: null,
  emailValidationTokenExpiration: null,
  isConfirmed: false,
  createdAt: new Date(),
  updatedAt: new Date(),
})

const defaultAccount = makeFakeAccount()

const makeAuthenticate = (): IAuthenticate => {
  class AuthenticateStub implements IAuthenticate {
    async auth(): Promise<IAuthenticateReturn | Error> {
      return { user: defaultAccount }
    }
  }

  return new AuthenticateStub()
}

const makeSut = (): {
  authenticate: IAuthenticate
  authenticateMiddleware: AuthenticateMiddleware
} => {
  const authenticate = makeAuthenticate()
  const authenticateMiddleware = new AuthenticateMiddleware(authenticate)

  return {
    authenticate,
    authenticateMiddleware,
  }
}

describe('Authenticate Middleware', () => {
  it('should return 403 if no authorization is found in headers', async () => {
    const { authenticateMiddleware } = makeSut()

    const httpResponse = await authenticateMiddleware.handle({})

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  it('should return 403 if token is invalid', async () => {
    const { authenticateMiddleware } = makeSut()

    const httpResponse = await authenticateMiddleware.handle({
      headers: {
        authorization: 'Bearer',
      },
    })

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  it('should return 403 if Authenticate returns an error', async () => {
    const { authenticateMiddleware, authenticate } = makeSut()

    jest.spyOn(authenticate, 'auth').mockResolvedValueOnce(new Error('Erro'))

    const httpResponse = await authenticateMiddleware.handle({
      headers: {
        authorization: 'Bearer token',
      },
    })

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  it('should return 500 if Authenticate throws an error', async () => {
    const { authenticateMiddleware, authenticate } = makeSut()

    jest.spyOn(authenticate, 'auth').mockRejectedValueOnce(new Error('Erro'))

    const httpResponse = await authenticateMiddleware.handle({
      headers: {
        authorization: 'Bearer token',
      },
    })

    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  it('should return 200', async () => {
    const { authenticateMiddleware } = makeSut()

    const httpResponse = await authenticateMiddleware.handle({
      headers: {
        authorization: 'Bearer token',
      },
    })

    expect(httpResponse).toEqual(
      ok({
        user: defaultAccount,
      })
    )
  })
})
