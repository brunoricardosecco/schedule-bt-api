import { IAuthorize } from '@/domain/usecases/authorize'
import { AccountPostgresRepository } from '@/infra/db/postgres/account/account-postgres-repository'
import { Authorize } from '@/data/usecases/authorize/authorize'

export const makeAuthorize = (): IAuthorize => {
  const accountPostgresRepository = new AccountPostgresRepository()

  return new Authorize(accountPostgresRepository)
}
