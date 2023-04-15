import { RoleEnum } from '@/domain/enums/role-enum'
import { Company } from '@/domain/models/company'
import { db } from '../../orm/prisma'
import { ReservationPostgresRepository } from './reservation-postgres-repository'

const makeSut = (): ReservationPostgresRepository => {
  return new ReservationPostgresRepository()
}

describe('Reservation Postgres Repository', () => {
  let createdCompany: Company

  beforeAll(async () => {
    createdCompany = await db.companies.create({
      data: {
        name: 'Empresa X',
        reservationPrice: 70,
        reservationTimeInMinutes: 60,
      },
    })
  })

  afterAll(async () => {
    await db.$transaction([db.reservations.deleteMany({}), db.accounts.deleteMany({}), db.companies.deleteMany({})])
  })
  afterEach(async () => {
    await db.$transaction([db.reservations.deleteMany({}), db.accounts.deleteMany({}), db.companies.deleteMany({})])
  })
  describe('findBy', () => {
    it('it should return reservations on success', async () => {
      const sut = makeSut()

      const account = await db.accounts.create({
        data: {
          email: 'any_email2@mail.com',
          name: 'any_name',
          hashedPassword: 'any_password',
          companyId: createdCompany.id,
          role: RoleEnum.COMPANY_ADMIN,
        },
      })

      await db.reservations.createMany({
        data: [
          {
            accountId: account.id,
            companyId: createdCompany.id,
            description: 'must return',
            date: new Date(new Date().setHours(0, 0, 0, 0)),
            startTime: '09:00',
            endTime: '10:00',
            price: 0,
          },
          // Adding this reservation below in D+1 to guarantee that it won't be returned for the current day filter
          {
            accountId: account.id,
            companyId: createdCompany.id,
            description: 'must not return',
            date: new Date(new Date().setDate(new Date().getDate() + 1)),
            startTime: '09:00',
            endTime: '10:00',
            price: 0,
          },
        ],
      })

      const reservations = await sut.findBy({
        companyId: createdCompany.id,
        startAt: new Date(new Date().setHours(0, 0, 0, 0)),
        endAt: new Date(new Date().setHours(23, 59, 59, 999)),
      })

      expect(reservations.length).toBeGreaterThan(0)
      expect(reservations.length).toEqual(1)
      expect(reservations[0].id).toEqual(expect.any(String))
    })
    it('it should return an empty array if there is no reservation for a specific query', async () => {
      const sut = makeSut()

      const reservations = await sut.findBy({
        companyId: createdCompany.id,
        startAt: new Date(new Date().setHours(0, 0, 0, 0)),
        endAt: new Date(new Date().setHours(23, 59, 59, 999)),
      })

      expect(reservations.length).toEqual(0)
    })
  })
})
