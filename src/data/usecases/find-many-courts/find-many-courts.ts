import { IFindManyCourts, FindManyCourtsRepository, FindManyCourtsReturn, FindManyCourtsParams, LoadAccountByIdRepository } from './find-many-courts.protocols'

export class FindManyCourts implements IFindManyCourts {
  constructor (
    private readonly accountRepository: LoadAccountByIdRepository,
    private readonly courtRepository: FindManyCourtsRepository
  ) {}

  async findMany ({ userId }: FindManyCourtsParams): FindManyCourtsReturn {
    let companyId

    // TODO: Refactor to receive the `companyId` instead of `userId`
    if (userId) {
      const user = await this.accountRepository.loadById(userId)

      if (!user) {
        return new Error('Usuário não encontrado')
      }

      companyId = user?.companyId

      if (!companyId) {
        return new Error('Usuário não está vinculado a uma empresa')
      }
    }

    const courts = await this.courtRepository.findMany({
      companyId: companyId ?? undefined
    })

    return courts
  }
}
