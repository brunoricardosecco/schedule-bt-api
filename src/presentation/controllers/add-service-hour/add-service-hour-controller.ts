import { badRequest, ok, serverError } from '@/presentation/helpers/http/httpHelper'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  IAddServiceHour,
  Validation,
} from './add-service-hour-controller.protocols'

export class AddServiceHourController implements Controller {
  constructor(private readonly addServiceHour: IAddServiceHour, private readonly validation: Validation) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const {
        body: { weekday, startTime, endTime },
        user,
      } = httpRequest

      const serviceHourOrError = await this.addServiceHour.add({
        companyId: user?.companyId as string,
        endTime,
        startTime,
        weekday,
      })

      if (serviceHourOrError instanceof Error) {
        return badRequest(serviceHourOrError)
      }

      return ok({
        serviceHour: serviceHourOrError,
      })
    } catch (error) {
      return serverError(error)
    }
  }
}
