import { ICreateCourts, CreateCourtModel, CreateCourtsRepository, CreateCourtsReturn, LoadAccountByIdRepository } from './create-courts.protocols'

export class CreateCourts implements ICreateCourts {
  constructor (
    private readonly accountRepository: LoadAccountByIdRepository,
    private readonly courtRepository: CreateCourtsRepository
  ) {}

  async create (userId: string, courts: CreateCourtModel[]): CreateCourtsReturn {
    const user = await this.accountRepository.loadById(userId)

    if (!user) {
      return new Error('Usuário não encontrado')
    }

    const courtsCount = await this.courtRepository.createMany(courts.map(court => ({
      ...court,
      companyId: user.companyId as string
    })))

    return courtsCount
  }
}
