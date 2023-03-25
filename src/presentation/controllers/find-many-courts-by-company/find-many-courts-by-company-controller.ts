import { Controller, HttpRequest, HttpResponse, IFindManyCourts } from './find-many-courts-by-company.protocols'
import { ok, serverError } from '@/presentation/helpers/http/httpHelper'

export class FindManyCourtsByCompanyController implements Controller {
  constructor (
    private readonly findManyCourts: IFindManyCourts
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
