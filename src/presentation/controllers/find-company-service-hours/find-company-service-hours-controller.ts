import { ok, serverError } from '@/presentation/helpers/http/httpHelper'
import { queryParser } from '@/presentation/helpers/request/query-parser'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  IFindServiceHours,
} from './find-company-service-hours-controller.protocols'

export class FindCompanyServiceHoursController implements Controller {
  constructor(private readonly findServiceHours: IFindServiceHours) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { query, user } = httpRequest
      const parsedQuery = queryParser(query)

      const serviceHours = await this.findServiceHours.find({
        companyId: user?.companyId as string,
        weekday: parsedQuery.weekday,
      })

      return ok({
        serviceHours,
      })
    } catch (error) {
      return serverError(error)
    }
  }
}
