import { badRequest, ok, serverError } from '@/presentation/helpers/http/httpHelper'
import { Controller, HttpRequest, HttpResponse, Validation, IAddServiceHour } from './add-service-hour-controller.protocols'

export class AddServiceHourController implements Controller {
  constructor (
    private readonly addServiceHour: IAddServiceHour,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      // TODO: Atualmente estamos recebendo o companyId no body, após alteração do middleware, alterar para pegar da própria request
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
