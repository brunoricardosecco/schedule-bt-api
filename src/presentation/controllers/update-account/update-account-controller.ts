import { Controller, HttpRequest, HttpResponse, IUpdateAccount } from './update-account.protocols'
import { badRequest, ok, serverError } from '@/presentation/helpers/http/httpHelper'

export class UpdateAccountController implements Controller {
  constructor (
    private readonly updateAccount: IUpdateAccount
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { user } = httpRequest
      const { password, name } = httpRequest.body

      const accountOrError = await this.updateAccount.update(
        user?.id as string,
        {
          password,
          name
        }
      )

      if (accountOrError instanceof Error) {
        return badRequest(accountOrError)
      }

      return ok({
        account: accountOrError
      })
    } catch (error) {
      return serverError(error)
    }
  }
}
