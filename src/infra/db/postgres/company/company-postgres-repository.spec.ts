import { db } from '@/infra/db/orm/prisma'
import { CompanyPostgresRepository } from './company-postgres-repository'

const makeSut = (): CompanyPostgresRepository => {
  return new CompanyPostgresRepository()
}

describe('Company Postgres Repository', () => {
  afterEach(async () => {
    await db.$executeRawUnsafe('TRUNCATE TABLE "companies" CASCADE;')
  })

  it('should return an company on add success', async () => {
    const sut = makeSut()
    const params = {
      name: 'any_name',
      reservationPrice: 60,
      reservationTimeInMinutes: 80
    }
    const company = await sut.add(params)

    expect(company).toBeTruthy()
    expect(company.id).toBeTruthy()
    expect(company.name).toBe(params.name)
    expect(company.reservationPrice).toBe(params.reservationPrice)
    expect(company.reservationTimeInMinutes).toBe(params.reservationTimeInMinutes)
  })
})
