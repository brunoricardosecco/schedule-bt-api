import { Controller, HttpRequest, HttpResponse, IUpdateAccountPassword, Validation } from './update-account-password.protocols'
import { badRequest, ok, serverError } from '@/presentation/helpers/http/httpHelper'

export class UpdateAccountPasswordController implements Controller {
  constructor (
    private readonly updateAccountPassword: IUpdateAccountPassword,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const { user } = httpRequest
      const { password } = httpRequest.body

      const account = await this.updateAccountPassword.update(user?.id as string, password)

      return ok({
        account
      })
    } catch (error) {
      return serverError(error)
    }
  }
}
