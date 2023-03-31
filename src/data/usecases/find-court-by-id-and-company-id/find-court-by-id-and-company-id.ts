import { Court, FindCourtByIdAndCompanyIdRepository, IFindCourtByIdAndCompanyId } from './find-court-by-id-and-company-id.protocols'

export class FindCourtByIdAndCompanyId implements IFindCourtByIdAndCompanyId {
  constructor (
    private readonly courtRepository: FindCourtByIdAndCompanyIdRepository
  ) {}

  async findByIdAndCompanyId (courtId: string, companyId: string): Promise<Court | null> {
    const court = await this.courtRepository.findByIdAndCompanyId(courtId, companyId)
    return court
  }
}
