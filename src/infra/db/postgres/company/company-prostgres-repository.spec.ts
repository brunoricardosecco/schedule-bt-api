import { db } from '@/infra/db/orm/prisma'
import { CompanyPostgresRepository } from './company-prostgres-repository'

const makeSut = (): CompanyPostgresRepository => {
  return new CompanyPostgresRepository()
}

describe('Company Postgres Repository', () => {
  afterAll(async () => {
    const deleteCompanies = db.companies.deleteMany()
    await db.$transaction([
      deleteCompanies
    ])
    await db.$disconnect()
  })

  afterEach(async () => {
    const deleteCompanies = db.companies.deleteMany()
    await db.$transaction([
      deleteCompanies
    ])
  })

  it('should return an company on add success', async () => {
    const sut = makeSut()
    const company = await sut.add({
      name: 'any_name',
      reservationPrice: '60.00',
      reservationTimeInMinutes: 80
    })

    expect(company).toBeTruthy()
    expect(company.id).toBeTruthy()
    expect(company.name).toBe('any_name')
    expect(company.reservationPrice).toBe('60.00')
    expect(company.reservationTimeInMinutes).toBe(80)
  })
})
