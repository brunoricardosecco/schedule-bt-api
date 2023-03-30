import { DeleteCourtByIdRepository } from '@/data/protocols/db/court/delete-court-by-id-repository'
import { IDeleteCourtById } from '@/domain/usecases/delete-court-by-id'
import { Court } from './delete-court-by-id.protocols'

export class DeleteCourtById implements IDeleteCourtById {
  constructor (
    private readonly deleteCourt: DeleteCourtByIdRepository
  ) {}

  async deleteById (courtId: string): Promise<Court> {
    return await this.deleteCourt.deleteById(courtId)
  }
}