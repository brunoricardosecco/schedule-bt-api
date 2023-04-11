import { FindCourtsParams, FindCourtsRepository, FindCourtsReturn, IFindCourts } from './find-courts.protocols'

export class FindCourts implements IFindCourts {
  constructor(private readonly courtRepository: FindCourtsRepository) {}

  async findMany({ companyId }: FindCourtsParams): FindCourtsReturn {
    const courts = await this.courtRepository.findMany({
      companyId,
    })

    return courts
  }
}
