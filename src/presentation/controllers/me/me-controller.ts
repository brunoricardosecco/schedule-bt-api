import { ok, serverError } from '@/presentation/helpers/http/httpHelper'
import { Controller, HttpRequest, HttpResponse, IFindAccountById } from './me-controller.protocols'

export class MeController implements Controller {
  constructor(private readonly findAccount: IFindAccountById) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { user } = httpRequest

      const account = await this.findAccount.findById(user?.id as string)

      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
