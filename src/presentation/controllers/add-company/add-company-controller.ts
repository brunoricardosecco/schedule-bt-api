import { badRequest, ok, serverError } from '@/presentation/helpers/http/httpHelper'
import { AddCompany, Controller, HttpRequest, HttpResponse, Validation } from './add-company-controller.protocols'

export class AddCompanyController implements Controller {
  constructor(private readonly addCompany: AddCompany, private readonly validation: Validation) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const { name, reservationPrice, reservationTimeInMinutes } = httpRequest.body

      const company = await this.addCompany.add({
        name,
        reservationPrice,
        reservationTimeInMinutes,
      })

      return ok({
        company,
      })
    } catch (error) {
      return serverError(error)
    }
  }
}
