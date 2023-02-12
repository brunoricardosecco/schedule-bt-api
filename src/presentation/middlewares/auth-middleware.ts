import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http/httpHelper'
import { HttpRequest, HttpResponse } from '../protocols'
import { Middleware } from '../protocols/middleware'

export class AuthMiddleware implements Middleware {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.headers?.Authorization) {
      return forbidden(new AccessDeniedError())
    }
    return {
      body: {},
      statusCode: 200
    }
  }
}
