import { Role } from '@/domain/models/role'
import { IAuthorize } from '@/domain/usecases/authorize'
import { ok, serverError, unauthorized } from '@/presentation/helpers/http/httpHelper'
import { HttpRequest, HttpResponse } from '@/presentation/protocols'
import { Middleware } from '@/presentation/protocols/middleware'

export class AuthorizeMiddleware implements Middleware {
  constructor (
    private readonly authorizedRoles: Role[],
    private readonly authorize: IAuthorize
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      if (!httpRequest.user?.id) {
        return unauthorized()
      }

      const { user } = httpRequest

      const isUserAuthorized = await this.authorize.authorize(user, this.authorizedRoles)

      if (!isUserAuthorized) {
        return unauthorized()
      }

      return ok(isUserAuthorized)
    } catch (error) {
      return serverError(error)
    }
  }
}
