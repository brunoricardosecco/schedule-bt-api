import { Court } from '@/domain/models/court'

export interface DeleteCourtByIdRepository {
  deleteById: (courtId: string) => Promise<Court>
}