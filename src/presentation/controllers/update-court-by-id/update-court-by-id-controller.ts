import { notFound, ok, serverError } from '@/presentation/helpers/http/httpHelper'
import { Controller, HttpRequest, HttpResponse, IUpdateCourtById, NotFoundError } from './update-court-by-id.protocols'

export class UpdateCourtByIdController implements Controller {
  constructor(private readonly updateCourt: IUpdateCourtById) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { params, user } = httpRequest

      const updatedCourtOrError = await this.updateCourt.updateById({
        id: params.courtId,
        companyId: user?.companyId as string,
        data: httpRequest.body,
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
