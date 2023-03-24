import { AddServiceHour } from '@/domain/usecases/add-service-hour'
import { ok, serverError } from '@/presentation/helpers/http/httpHelper'
import { Controller, HttpRequest, HttpResponse, Validation } from '../add-company/add-company-controller.protocols'

export class AddServiceHourController implements Controller {
  constructor (
    private readonly addServiceHour: AddServiceHour,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      this.validation.validate(httpRequest.body)

      const serviceHour = await this.addServiceHour.add(httpRequest.body)

      return ok({
        serviceHour
      })
    } catch (error) {
      return serverError(error)
    }
  }
}
