import { Controller, HttpRequest, HttpResponse, AddAccount, Validation, IAuthenticationByPassword } from './signup-controller.protocols'
import { badRequest, ok, serverError } from '@/presentation/helpers/http/httpHelper'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: IAuthenticationByPassword
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const { email, password, name, companyId, role } = httpRequest.body

      const accountOrError = await this.addAccount.add({ email, name, password, companyId, role })

      if (accountOrError instanceof Error) {
        return badRequest(accountOrError)
      }

      const accessToken = await this.authentication.auth({ email, password })

      return ok({
        account: accountOrError,
        accessToken
      })
    } catch (error) {
      console.log(error)
      return serverError(error)
    }
  }
}
