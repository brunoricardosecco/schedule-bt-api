import { CreateCourts } from '@/data/usecases/create-courts/create-courts'
import { CourtPostgresRepository } from '@/infra/db/postgres/court/court-postgres-repository'
import { AccountPostgresRepository } from '@/infra/db/postgres/account/account-postgres-repository'

export const createCourtsFactory = (): CreateCourts => {
  const accountPostgresRepository = new AccountPostgresRepository()
  const courtPostgresRepository = new CourtPostgresRepository()

  return new CreateCourts(accountPostgresRepository, courtPostgresRepository)
}
