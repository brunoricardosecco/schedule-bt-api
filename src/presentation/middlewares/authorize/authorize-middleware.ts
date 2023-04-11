import { Role } from '@/domain/models/role'
import { IAuthorize } from '@/domain/usecases/authorize'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/httpHelper'
import { HttpRequest, HttpResponse } from '@/presentation/protocols'
import { Middleware } from '@/presentation/protocols/middleware'

export class AuthorizeMiddleware implements Middleware {
  constructor(private readonly authorizedRoles: Role[], private readonly authorize: IAuthorize) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      if (!httpRequest.user?.id) {
        return forbidden()
      }

      const { user } = httpRequest

      const isUserAuthorized = await this.authorize.authorize(user, this.authorizedRoles)

      if (!isUserAuthorized) {
        return forbidden()
      }

      return ok(isUserAuthorized)
    } catch (error) {
      return serverError(error)
    }
  }
}
