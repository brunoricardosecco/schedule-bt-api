import { Controller, HttpRequest, HttpResponse, AddAccount, Validation, Authentication } from './signup-controller.protocols'
import { badRequest, ok, serverError } from '@/presentation/helpers/http/httpHelper'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const { email, password, name } = httpRequest.body

      const account = await this.addAccount.add({ email, name, password })

      const accessToken = await this.authentication.auth({ email, password })

      return ok({
        account,
        accessToken
      })
    } catch (error) {
      return serverError(error)
    }
  }
}
