import { AccessDeniedError } from '@/presentation/errors'
import { forbidden } from '@/presentation/helpers/http/httpHelper'
import { HttpRequest, HttpResponse } from '@/presentation/protocols'
import { Middleware } from '@/presentation/protocols/middleware'

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
