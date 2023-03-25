import { FindServiceHours } from '@/domain/usecases/find-service-hours'
import { ok, serverError } from '@/presentation/helpers/http/httpHelper'
import { Controller, HttpRequest, HttpResponse } from '../add-company/add-company-controller.protocols'

export class FindServiceHoursController implements Controller {
  constructor (
    private readonly findServiceHours: FindServiceHours
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { headers: filters } = httpRequest

      const serviceHours = await this.findServiceHours.find(filters)

      return ok({
        serviceHours
      })
    } catch (error) {
      return serverError(error)
    }
  }
}
