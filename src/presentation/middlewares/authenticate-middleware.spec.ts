import { IAuthenticate, IAuthenticateReturn } from '@/domain/usecases/authenticate'
import { AccessDeniedError } from '@/presentation/errors'
import { forbidden } from '@/presentation/helpers/http/httpHelper'
import { AuthenticateMiddleware } from './authenticate-middleware'

const makeAuthenticate = (): IAuthenticate => {
  class AuthenticateStub implements IAuthenticate {
    async auth (): Promise<IAuthenticateReturn | Error> {
      return await new Promise(resolve => { resolve({ userId: '1' }) })
    }
  }

  return new AuthenticateStub()
}

const makeSut = (): AuthenticateMiddleware => {
  const authenticate = makeAuthenticate()

  return new AuthenticateMiddleware(authenticate)
}

describe('Authenticate Middleware', () => {
  it('should return 403 if no authorization is found in headers', async () => {
    const sut = makeSut()
    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
})
