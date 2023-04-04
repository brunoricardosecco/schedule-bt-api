import { badRequest, notFound, ok, serverError } from '@/presentation/helpers/http/httpHelper'
import { Controller, HttpRequest, HttpResponse, IUpdateCourtById, NotFoundError, Validation } from './update-court-by-id.protocols'

export class UpdateCourtByIdController implements Controller {
  constructor (
    private readonly updateCourt: IUpdateCourtById,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const { params, user } = httpRequest

      const updatedCourtOrError = await this.updateCourt.updateById({
        id: params.courtId,
        companyId: user?.companyId as string,
        data: httpRequest.body
      })

      if (updatedCourtOrError instanceof NotFoundError) {
        return notFound(updatedCourtOrError.message)
      }

      return ok(updatedCourtOrError)
    } catch (error) {
      return serverError(error)
    }
  }
}
