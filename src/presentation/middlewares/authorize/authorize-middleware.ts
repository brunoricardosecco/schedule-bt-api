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

      const isUserAuthorizedOrError = await this.authorize.authorize(user, this.authorizedRoles)

      if (isUserAuthorizedOrError instanceof Error) {
        return unauthorized()
      }

      if (!isUserAuthorizedOrError) {
        return unauthorized()
      }

      return ok(isUserAuthorizedOrError)
    } catch (error) {
      return serverError(error)
    }
  }
}
