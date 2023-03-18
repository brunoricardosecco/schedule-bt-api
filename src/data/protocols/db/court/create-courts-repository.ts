import { Court } from '@/domain/models/court'
import { CreateCourtModel } from '@/domain/usecases/create-courts'

export interface CreateCourtsRepository {
  createMany: (courts: CreateCourtModel[]) => Promise<Court>
}
