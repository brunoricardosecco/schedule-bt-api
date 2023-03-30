import { FindCourtByIdAndCompanyIdRepository } from '@/data/protocols/db/court/find-court-by-id-and-company-id.repository'
import { IFindCourtByIdAndCompanyId } from '@/domain/usecases/find-court-by-id'
import { Court } from './find-court-by-id-and-company-id.protocols'

export class FindCourtByIdAndCompanyId implements IFindCourtByIdAndCompanyId {
  constructor (
    private readonly courtRepository: FindCourtByIdAndCompanyIdRepository
  ) {}

  async findByIdAndCompanyId (courtId: string, companyId: string): Promise<Court | null> {
    const court = await this.courtRepository.findByIdAndCompanyId(courtId, companyId)
    return court
  }
}
