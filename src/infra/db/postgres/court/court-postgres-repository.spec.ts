import { Company } from '@/domain/models/company'
import { db } from '@/infra/db/orm/prisma'
import { CourtPostgresRepository } from './court-postgres-repository'

const makeSut = (): CourtPostgresRepository => {
  return new CourtPostgresRepository()
}

describe('Court Postgres Repository', () => {
  let createdCompany: Company

  beforeAll(async () => {
    createdCompany = await db.companies.create({
      data: {
        name: 'Empresa X',
        reservationPrice: 70,
        reservationTimeInMinutes: 60
      }
    })
  })

  afterEach(async () => {
    await db.courts.deleteMany()
  })

  afterAll(async () => {
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

  it('should find courts', async () => {
    const sut = makeSut()
    const params = [
      {
        id: '1',
        name: 'Quadra 1',
        companyId: createdCompany.id,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Quadra 2',
        companyId: createdCompany.id,
        status: 'INACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
    const courtCount = await sut.createMany(params)
    const courts = await sut.findMany({ companyId: createdCompany.id })

    expect(courtCount).toBe(params.length)
    expect(courts.length).toBe(1)
  })

  it('should find court', async () => {
    const sut = makeSut()
    const params = [
      {
        id: '1',
        name: 'Quadra 1',
        companyId: createdCompany.id,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Quadra 2',
        companyId: createdCompany.id,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
    await sut.createMany(params)
    const court = await sut.findByIdAndCompanyId(params[0].id, params[0].companyId)

    expect(court).toEqual(params[0])
  })

  it('should delete court', async () => {
    const sut = makeSut()
    const params = [
      {
        id: '1',
        name: 'Quadra 1',
        companyId: createdCompany.id,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Quadra 2',
        companyId: createdCompany.id,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
    await sut.createMany(params)
    const court = await sut.findByIdAndCompanyId(params[0].id, params[0].companyId)
    const courtDeleted = await sut.deleteById(court?.id as string)

    expect(courtDeleted).toEqual({ ...params[0], status: 'INACTIVE' })
  })
})
