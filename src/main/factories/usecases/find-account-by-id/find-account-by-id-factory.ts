import { FindAccountById } from '@/data/usecases/find-account-by-id/find-account-by-id'
import { AccountPostgresRepository } from '@/infra/db/postgres/account/account-postgres-repository'

export const makeFindAccountByIdFactory = (): FindAccountById => {
  const accountPostgresRepository = new AccountPostgresRepository()
  return new FindAccountById(accountPostgresRepository)
}
