import { IAuthenticate } from '@/domain/usecases/authenticate'
import { ok, serverError, unauthorized } from '@/presentation/helpers/http/httpHelper'
import { HttpRequest, HttpResponse } from '@/presentation/protocols'
import { Middleware } from '@/presentation/protocols/middleware'

export class AuthenticateMiddleware implements Middleware {
  constructor(private readonly authenticate: IAuthenticate) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      if (!httpRequest.headers?.authorization) {
        return unauthorized()
      }

      const [, token] = httpRequest.headers.authorization.split('Bearer ')

      if (!token) {
        return unauthorized()
      }

      const payloadOrError = await this.authenticate.auth(token)

      if (payloadOrError instanceof Error) {
        return unauthorized()
      }

      return ok(payloadOrError)
    } catch (error) {
      return serverError(error)
    }
  }
}
