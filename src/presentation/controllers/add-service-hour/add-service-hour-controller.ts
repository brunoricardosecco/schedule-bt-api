import { AddServiceHour } from '@/domain/usecases/add-service-hour'
import { Controller, HttpRequest, HttpResponse } from '../add-company/add-company-controller.protocols'

export class AddServiceHourController implements Controller {
  constructor (
    private readonly addServiceHour: AddServiceHour
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.addServiceHour.add(httpRequest.body)

    return {
      statusCode: 1,
      body: {}
    }
  }
}
