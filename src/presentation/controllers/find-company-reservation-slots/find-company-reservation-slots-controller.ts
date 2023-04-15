import { badRequest, ok, serverError } from '@/presentation/helpers/http/httpHelper'
import { Controller, HttpRequest, HttpResponse, Validation } from '@/presentation/protocols'
import { IFindReservationSlots } from './find-company-reservation-slots-controller.protocols'

export class FindCompanyReservationSlotsController implements Controller {
  constructor(private readonly validation: Validation, private readonly findReservationSlots: IFindReservationSlots) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.query)
      if (error) {
        return badRequest(error)
      }

      const {
        user,
        query: { date },
      } = httpRequest
      const dateObj = new Date(date)

      const slotsOrError = await this.findReservationSlots.find({
        date: dateObj,
        companyId: user?.companyId as string,
      })

      if (slotsOrError instanceof Error) {
        return badRequest(slotsOrError)
      }

      return ok({
        slots: slotsOrError,
      })
    } catch (error) {
      return serverError(error)
    }
  }
}
