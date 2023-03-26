import { db } from '@/infra/db/orm/prisma'
import { CourtPostgresRepository } from './court-postgres-repository'

const makeSut = (): CourtPostgresRepository => {
  return new CourtPostgresRepository()
}

describe('Court Postgres Repository', () => {
  let createdCompany

  beforeAll(async () => {
    createdCompany = await db.companies.create({
      data: {
        name: 'Empresa X',
        reservationPrice: 70,
        reservationTimeInMinutes: 60
      }
    })
  })

  afterAll(async () => {
    await db.courts.deleteMany()
    await db.companies.delete({
      where: {
        id: createdCompany.id
      }
    })
  })

  it('should create courts', async () => {
    const sut = makeSut()
    const params = [
      {
        name: 'Quadra 1',
        companyId: createdCompany.id
      },
      {
        name: 'Quadra 2',
        companyId: createdCompany.id
      }
    ]
    const courtCount = await sut.createMany(params)

    expect(courtCount).toBe(params.length)
  })
})
