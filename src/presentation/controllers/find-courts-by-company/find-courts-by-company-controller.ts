import { badRequest, ok, serverError } from '@/presentation/helpers/http/httpHelper'
import { Controller, HttpRequest, HttpResponse, IFindCourts } from './find-courts-by-company.protocols'

export class FindCourtsByCompanyController implements Controller {
  constructor(private readonly findManyCourts: IFindCourts) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { user } = httpRequest

      if (!user?.companyId) {
        return badRequest(new Error('Usuário não possui empresa vinculada'))
      }

      const courts = await this.findManyCourts.findMany({ companyId: user.companyId })

      return ok({
        courts,
      })
    } catch (error) {
      return serverError(error)
    }
  }
}
