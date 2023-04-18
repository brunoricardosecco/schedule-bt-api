import { IAuthenticate } from '@/domain/usecases/authenticate'
import { ServerError } from '@/presentation/errors'
import { ok, serverError, unauthorized } from '@/presentation/helpers/http/httpHelper'
import { mockAccount } from '@/test/domain/models/mock-account'
import { mockAuthenticate } from '@/test/domain/usecases/mock-authenticate'
import { AuthenticateMiddleware } from './authenticate-middleware'

const makeSut = (): {
  authenticate: IAuthenticate
  authenticateMiddleware: AuthenticateMiddleware
} => {
  const authenticate = mockAuthenticate()
  const authenticateMiddleware = new AuthenticateMiddleware(authenticate)

  return {
    authenticate,
    authenticateMiddleware,
  }
}

describe('Authenticate Middleware', () => {
  it('should return unauthorized if no authorization is found in headers', async () => {
    const { authenticateMiddleware } = makeSut()
    const httpResponse = await authenticateMiddleware.handle({})

    expect(httpResponse).toEqual(unauthorized())
  })

  it('should return unauthorized if token is invalid', async () => {
    const { authenticateMiddleware } = makeSut()
    const httpResponse = await authenticateMiddleware.handle({
      headers: { authorization: 'Bearer' },
    })

    expect(httpResponse).toEqual(unauthorized())
  })

  it('should return unauthorized if Authenticate returns an error', async () => {
    const { authenticateMiddleware, authenticate } = makeSut()
    jest.spyOn(authenticate, 'auth').mockResolvedValueOnce(new Error('Erro'))
    const httpResponse = await authenticateMiddleware.handle({
      headers: { authorization: 'Bearer token' },
    })

    expect(httpResponse).toEqual(unauthorized())
  })

  it('should throw an error if Authenticate throws an error', async () => {
    const { authenticateMiddleware, authenticate } = makeSut()
    jest.spyOn(authenticate, 'auth').mockRejectedValueOnce(new Error('Erro'))
    const httpResponse = await authenticateMiddleware.handle({
      headers: { authorization: 'Bearer token' },
    })

    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  it('should authenticate the user', async () => {
    const { authenticateMiddleware } = makeSut()
    const httpResponse = await authenticateMiddleware.handle({
      headers: { authorization: 'Bearer token' },
    })

    expect(httpResponse).toEqual(ok({ user: mockAccount() }))
  })
})
