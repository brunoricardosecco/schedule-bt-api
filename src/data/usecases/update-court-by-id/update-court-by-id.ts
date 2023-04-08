import {
  Court,
  FindCourtByIdAndCompanyIdRepository,
  IUpdateCourtById,
  NotFoundError,
  UpdateCourtByIdParams,
  UpdateCourtByIdRepository,
} from './update-court-by-id.protocols'

export class UpdateCourtById implements IUpdateCourtById {
  constructor(
    private readonly updateCourt: UpdateCourtByIdRepository,
    private readonly findCourt: FindCourtByIdAndCompanyIdRepository
  ) {}

  async updateById({ id, companyId, data }: UpdateCourtByIdParams): Promise<Error | Court> {
    const court = await this.findCourt.findByIdAndCompanyId(id, companyId)

    if (!court) {
      return new NotFoundError('Quadra não encontrada')
    }

    return await this.updateCourt.updateById({ id, data })
  }
}
