import { Controller, HttpRequest, HttpResponse, AddAccount, Validation } from './signup-controller.protocols'
import { badRequest, ok, serverError } from '../../helpers/http/httpHelper'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const { email, password, name } = httpRequest.body
      const account = await this.addAccount.add({ email, name, password })
      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
