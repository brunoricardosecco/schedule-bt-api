import { CreateCourtModel } from '@/domain/usecases/create-courts'

export interface CreateCourtsRepository {
  createMany: (courts: CreateCourtModel[]) => Promise<number>
}
