import { Controller, HttpRequest, HttpResponse, ICreateCourts, Validation } from './create-courts.protocols'
import { badRequest, ok, serverError } from '@/presentation/helpers/http/httpHelper'

export class CreateCourtsController implements Controller {
  constructor (
    private readonly createCourts: ICreateCourts,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const { user } = httpRequest
      const { courts } = httpRequest.body

      const courtsCountOrError = await this.createCourts.create(user?.companyId as string, courts)

      if (courtsCountOrError instanceof Error) {
        return badRequest(courtsCountOrError)
      }

      return ok({
        courtsCount: courtsCountOrError
      })
    } catch (error) {
      return serverError(error)
    }
  }
}
