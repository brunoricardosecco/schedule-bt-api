import { badRequest, ok, serverError } from '@/presentation/helpers/http/httpHelper'
import { Controller, HttpRequest, HttpResponse, IUpdateAccount } from './update-account.protocols'

export class UpdateAccountController implements Controller {
  constructor(private readonly updateAccount: IUpdateAccount) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { user } = httpRequest
      const { password, currentPassword, name } = httpRequest.body

      const accountOrError = await this.updateAccount.update(user?.id as string, {
        password,
        currentPassword,
        name,
      })

      if (accountOrError instanceof Error) {
        return badRequest(accountOrError)
      }

      return ok({
        account: accountOrError,
      })
    } catch (error) {
      return serverError(error)
    }
  }
}
