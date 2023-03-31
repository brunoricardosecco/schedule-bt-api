import { Court, DeleteCourtByIdRepository, IDeleteCourtById } from './delete-court-by-id.protocols'

export class DeleteCourtById implements IDeleteCourtById {
  constructor (
    private readonly deleteCourt: DeleteCourtByIdRepository
  ) {}

  async deleteById (courtId: string): Promise<Court> {
    return await this.deleteCourt.deleteById(courtId)
  }
}
