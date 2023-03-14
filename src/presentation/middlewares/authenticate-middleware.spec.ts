import { AccessDeniedError } from '@/presentation/errors'
import { forbidden } from '@/presentation/helpers/http/httpHelper'
import { AuthenticateMiddleware } from './authenticate-middleware'

describe('Auth Middleware', () => {
  it('should return 403 if no authorization is found in headers', async () => {
    const sut = new AuthenticateMiddleware()
    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
})
