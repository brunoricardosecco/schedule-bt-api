import { Controller, HttpRequest, HttpResponse, IFindCourts } from './find-courts-by-company.protocols'
import { ok, serverError } from '@/presentation/helpers/http/httpHelper'

export class FindCourtsByCompanyController implements Controller {
  constructor (
    private readonly findManyCourts: IFindCourts
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { userId } = httpRequest

      const courts = await this.findManyCourts.findMany({ userId })

      return ok({
        courts
      })
    } catch (error) {
      return serverError(error)
    }
  }
}
