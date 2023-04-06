import { Court } from '@/domain/models/court'

export interface IFindCourtByIdAndCompanyId {
  findByIdAndCompanyId: (courtId: string, companyId: string) => Promise<Court | null>
}
