import { IFindCourts, FindCourtsRepository, FindCourtsReturn, FindCourtsParams, LoadAccountByIdRepository } from './find-courts.protocols'

export class FindCourts implements IFindCourts {
  constructor (
    private readonly accountRepository: LoadAccountByIdRepository,
    private readonly courtRepository: FindCourtsRepository
  ) {}

  async findMany ({ userId }: FindCourtsParams): FindCourtsReturn {
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
