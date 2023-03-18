import { ICreateCourts, CreateCourtModel, CreateCourtsRepository, CreateCourtReturn } from './create-courts.protocols'

export class CreateCourts implements ICreateCourts {
  constructor (
    private readonly courtRepository: CreateCourtsRepository
  ) {}

  async create (companyId: string, courts: CreateCourtModel[]): CreateCourtReturn {
    const courtsCount = await this.courtRepository.createMany(courts.map(court => ({
      ...court,
      companyId
    })))

    return courtsCount
  }
}
