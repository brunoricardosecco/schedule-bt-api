import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/http/httpHelper'
import { IAuthenticateByPassword, Controller, HttpRequest, HttpResponse, Validation } from './authenticate-by-password-controller.protocols'

export class AuthenticateByPasswordController implements Controller {
  constructor (
    private readonly authenticateByPassword: IAuthenticateByPassword,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const { email, password } = httpRequest.body

      const accessToken = await this.authenticateByPassword.auth({ email, password })

      if (!accessToken) {
        return unauthorized()
      }

      return ok({
        accessToken
      })
    } catch (error) {
      return serverError(error)
    }
  }
}
