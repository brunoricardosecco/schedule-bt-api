import { ok, serverError } from '@/presentation/helpers/http/httpHelper'
import { queryParser } from '@/presentation/helpers/request/query-parser'
import { Controller, HttpRequest, HttpResponse, IFindServiceHours } from './find-service-hours-controller.protocols'

export class FindServiceHoursController implements Controller {
  constructor(private readonly findServiceHours: IFindServiceHours) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { query } = httpRequest
      const parsedQuery = queryParser(query)

      const serviceHours = await this.findServiceHours.find(parsedQuery)

      return ok({
        serviceHours,
      })
    } catch (error) {
      return serverError(error)
    }
  }
}
