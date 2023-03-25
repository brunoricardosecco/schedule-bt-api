import { IAuthenticate } from '@/domain/usecases/authenticate'
import { AccessDeniedError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/httpHelper'
import { HttpRequest, HttpResponse } from '@/presentation/protocols'
import { Middleware } from '@/presentation/protocols/middleware'

export class AuthenticateMiddleware implements Middleware {
  constructor (
    private readonly authenticate: IAuthenticate
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      if (!httpRequest.headers?.authorization) {
        return forbidden(new AccessDeniedError())
      }

      const [, token] = httpRequest.headers.authorization.split('Bearer ')

      if (!token) {
        return forbidden(new AccessDeniedError())
      }

      const payloadOrError = await this.authenticate.auth(token)

      if (payloadOrError instanceof Error) {
        return forbidden(new AccessDeniedError())
      }

      return ok(payloadOrError)
    } catch (error) {
      return serverError(error)
    }
  }
}
