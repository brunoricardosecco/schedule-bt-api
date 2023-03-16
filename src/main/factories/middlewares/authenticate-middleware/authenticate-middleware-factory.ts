import { Middleware } from '@/presentation/protocols/middleware'
import { makeAuthenticate } from '@/main/factories/usecases/authenticate/authenticate-factory'
import { AuthenticateMiddleware } from '@/presentation/middlewares/authenticate/authenticate-middleware'

export const makeAuthenticateMiddleware = (): Middleware => {
  return new AuthenticateMiddleware(makeAuthenticate())
}
