import { db } from '@/infra/db/orm/prisma'
import { CompanyPostgresRepository } from './company-postgres-repository'

const makeSut = (): CompanyPostgresRepository => {
  return new CompanyPostgresRepository()
}

describe('Company Postgres Repository', () => {
  afterEach(async () => {
    await db.$executeRawUnsafe('TRUNCATE TABLE "companies" CASCADE;')
  })

  describe('add', () => {
    it('should return an company on add success', async () => {
      const sut = makeSut()
      const params = {
        name: 'any_name',
        reservationPrice: 60,
        reservationTimeInMinutes: 80,
      }
      const company = await sut.add(params)

      expect(company).toBeTruthy()
      expect(company.id).toBeTruthy()
      expect(company.name).toBe(params.name)
      expect(company.reservationPrice).toBe(params.reservationPrice)
      expect(company.reservationTimeInMinutes).toBe(params.reservationTimeInMinutes)
    })
  })
  describe('findBy', () => {
    it('should return company list for a given filter on success', async () => {
      const sut = makeSut()

      const createdCompany = await db.companies.create({
        data: {
          name: 'any_name',
          reservationPrice: 1000,
          reservationTimeInMinutes: 60,
        },
      })

      const params = {
        companyId: createdCompany.id,
      }

      const companies = await sut.findBy(params)

      expect(companies.length).toEqual(1)
      expect(companies[0]).toEqual({
        id: expect.any(String),
        name: 'any_name',
        reservationPrice: 1000,
        reservationTimeInMinutes: 60,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    })
  })
})
