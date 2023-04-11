import { Role } from '@/domain/models/role'
import { makeAuthorize } from '@/main/factories/usecases/authorize/authorize-factory'
import { AuthorizeMiddleware } from '@/presentation/middlewares/authorize/authorize-middleware'
import { Middleware } from '@/presentation/protocols/middleware'

export const makeAuthorizeMiddleware = (authorizedRoles: Role[]): Middleware => {
  return new AuthorizeMiddleware(authorizedRoles, makeAuthorize())
}
