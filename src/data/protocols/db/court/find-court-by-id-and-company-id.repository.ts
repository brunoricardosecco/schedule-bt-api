import { Court } from '@/domain/models/court'

export interface FindCourtByIdAndCompanyIdRepository {
  findByIdAndCompanyId: (courtId: string, companyId: string) => Promise<Court | null>
}
