import { IDeleteServiceHour } from '@/domain/usecases/delete-service-hour'
import { okNoContent, serverError } from '@/presentation/helpers/http/httpHelper'
import { Controller, HttpRequest, HttpResponse } from '../add-company/add-company-controller.protocols'

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
