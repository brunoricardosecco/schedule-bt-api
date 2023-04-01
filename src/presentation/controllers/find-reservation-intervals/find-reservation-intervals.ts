import { badRequest, ok, serverError } from '@/presentation/helpers/http/httpHelper'
import { Controller, HttpRequest, HttpResponse, Validation } from '../add-company/add-company-controller.protocols'
import { IFindReservationIntervals } from '@/domain/usecases/find-reservation-intervals'

export class FindReservationIntervalsController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly findReservationIntervals: IFindReservationIntervals
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.query)
      if (error) {
        return badRequest(error)
      }

      const { user, query: { date } } = httpRequest
      const dateObj = new Date(date)

      const intervalsOrError = await this.findReservationIntervals.find({
        date: dateObj,
        companyId: user?.companyId as string
      })

      if (intervalsOrError instanceof Error) {
        return badRequest(intervalsOrError)
      }

      return ok({
        intervals: intervalsOrError
      })
    } catch (error) {
      return serverError(error)
    }
  }
}
