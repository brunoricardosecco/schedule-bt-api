import { ICreateCourts, CreateCourtModel, CreateCourtsRepository, CreateCourtReturn } from './create-courts.protocols'

export class CreateCourts implements ICreateCourts {
  constructor (
    private readonly courtRepository: CreateCourtsRepository
  ) {}

  async create (createCourtModels: CreateCourtModel[]): CreateCourtReturn {
    const courtsCount = await this.courtRepository.createMany(createCourtModels)

    return courtsCount
  }
}
