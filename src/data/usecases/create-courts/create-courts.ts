import { CreateCourtModel, CreateCourtsRepository, CreateCourtsReturn, ICreateCourts } from './create-courts.protocols'

export class CreateCourts implements ICreateCourts {
  constructor(private readonly courtRepository: CreateCourtsRepository) {}

  async create(companyId: string, courts: CreateCourtModel[]): CreateCourtsReturn {
    const courtsCount = await this.courtRepository.createMany(
      courts.map(court => ({
        ...court,
        companyId,
      }))
    )

    return courtsCount
  }
}
