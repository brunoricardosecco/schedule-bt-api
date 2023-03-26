import { okNoContent, serverError } from '@/presentation/helpers/http/httpHelper'
import { Controller, HttpRequest, HttpResponse, IDeleteServiceHour } from './delete-service-hour-controller.protocols'

export class DeleteServiceHourController implements Controller {
  constructor (
    private readonly deleteServiceHour: IDeleteServiceHour
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { serviceHourId } = httpRequest.params

      await this.deleteServiceHour.delete(serviceHourId)

      return okNoContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
