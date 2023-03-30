import { IDeleteCourtById } from '@/domain/usecases/delete-court-by-id'
import { IFindCourtByIdAndCompanyId } from '@/domain/usecases/find-court-by-id'
import { noContent, notFound, serverError } from '@/presentation/helpers/http/httpHelper'
import { Controller, HttpRequest, HttpResponse } from './delete-court-by-id.protocols'

export class DeleteCourtByIdController implements Controller {
  constructor (
    private readonly deleteCourt: IDeleteCourtById,
    private readonly findCourt: IFindCourtByIdAndCompanyId,
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { params, user } = httpRequest

      const court = await this.findCourt.findByIdAndCompanyId(params.courtId, user?.companyId as string)

      if (!court) {
        return notFound()
      }

      await this.deleteCourt.deleteById(params.courtId)

      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
