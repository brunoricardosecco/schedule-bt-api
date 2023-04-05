import { Controller, HttpRequest, HttpResponse, IUpdateAccount } from './update-account.protocols'
import { ok, serverError } from '@/presentation/helpers/http/httpHelper'

export class UpdateAccountController implements Controller {
  constructor (
    private readonly updateAccount: IUpdateAccount
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { user } = httpRequest
      const { password, name } = httpRequest.body

      const account = await this.updateAccount.update(
        user?.id as string,
        {
          password,
          name
        }
      )

      return ok({
        account
      })
    } catch (error) {
      return serverError(error)
    }
  }
}
