import { AccessDeniedError } from '@/presentation/errors'
import { forbidden } from '@/presentation/helpers/http/httpHelper'
import { AuthMiddleware } from './auth-middleware'

describe('Auth Middleware', () => {
  it('should return 403 if no authorization is found in headers', async () => {
    const sut = new AuthMiddleware()
    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
})
