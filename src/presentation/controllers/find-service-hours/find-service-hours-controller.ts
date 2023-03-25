import { FindServiceHours } from '@/domain/usecases/find-service-hours'
import { ok, serverError } from '@/presentation/helpers/http/httpHelper'
import { queryParser } from '@/presentation/helpers/request/query-parser'
import { Controller, HttpRequest, HttpResponse } from '../add-company/add-company-controller.protocols'

export class FindServiceHoursController implements Controller {
  constructor (
    private readonly findServiceHours: FindServiceHours
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { query } = httpRequest
      const parsedQuery = queryParser(query)

      const serviceHours = await this.findServiceHours.find(parsedQuery)

      return ok({
        serviceHours
      })
    } catch (error) {
      return serverError(error)
    }
  }
}
