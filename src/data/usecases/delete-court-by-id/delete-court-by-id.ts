import { NotFoundError } from '@/domain/errors/not-found-error'
import { Court, DeleteCourtByIdRepository, FindCourtByIdAndCompanyIdRepository, IDeleteCourtById } from './delete-court-by-id.protocols'

export class DeleteCourtById implements IDeleteCourtById {
  constructor (
    private readonly deleteCourt: DeleteCourtByIdRepository,
    private readonly findCourt: FindCourtByIdAndCompanyIdRepository
  ) {}

  async deleteById (courtId: string, companyId: string): Promise<Court | Error> {
    const court = await this.findCourt.findByIdAndCompanyId(courtId, companyId)

    if (!court) {
      return new NotFoundError('Quadra não encontrada')
    }

    return await this.deleteCourt.deleteById(courtId)
  }
}
