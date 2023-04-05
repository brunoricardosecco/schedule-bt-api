import { noContent, notFound, serverError } from '@/presentation/helpers/http/httpHelper'
import { Controller, HttpRequest, HttpResponse, IDeleteCourtById, NotFoundError } from './delete-court-by-id.protocols'

export class DeleteCourtByIdController implements Controller {
  constructor (
    private readonly deleteCourt: IDeleteCourtById
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { params, user } = httpRequest

      const courtOrError = await this.deleteCourt.deleteById(params.courtId, user?.companyId as string)

      if (courtOrError instanceof NotFoundError) {
        return notFound(courtOrError.message)
      }

      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
