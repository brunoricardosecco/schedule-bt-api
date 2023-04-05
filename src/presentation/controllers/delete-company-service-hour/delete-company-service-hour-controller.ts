import { badRequest, okNoContent, serverError } from '@/presentation/helpers/http/httpHelper'
import { Controller, HttpRequest, HttpResponse, IDeleteServiceHour } from './delete-company-service-hour-controller.protocols'

export class DeleteCompanyServiceHourController implements Controller {
  constructor (
    private readonly deleteServiceHour: IDeleteServiceHour
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { params: { serviceHourId }, user } = httpRequest

      const deletedServiceHourOrError = await this.deleteServiceHour.delete({
        serviceHourId,
        companyId: user?.companyId as string
      })

      if (deletedServiceHourOrError instanceof Error) {
        return badRequest(deletedServiceHourOrError)
      }

      return okNoContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
