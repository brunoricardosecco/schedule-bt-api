import { badRequest, ok, serverError } from '@/presentation/helpers/http/httpHelper'
import { Controller, HttpRequest, HttpResponse, Validation, AddServiceHour } from './add-service-hour-controller.protocols'

export class AddServiceHourController implements Controller {
  constructor (
    private readonly addServiceHour: AddServiceHour,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const serviceHourOrError = await this.addServiceHour.add(httpRequest.body)

      if (serviceHourOrError instanceof Error) {
        return badRequest(serviceHourOrError)
      }

      return ok({
        serviceHour: serviceHourOrError
      })
    } catch (error) {
      return serverError(error)
    }
  }
}
