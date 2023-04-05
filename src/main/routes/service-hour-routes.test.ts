import request from 'supertest'
import { db } from '@/infra/db/orm/prisma'
import app from '@/main/config/app'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { RoleEnum } from '@/domain/enums/role-enum'

describe('ServiceHour Routes', () => {
  const password = 'password'
  const companyAdminEmail = 'company_admin@mail.com'
  const generalAdminEmail = 'generala_dmin@mail.com'
  let createdCompany

  beforeEach(async () => {
    createdCompany = await db.companies.create({
      data: {
        name: 'Empresa X',
        reservationPrice: 70,
        reservationTimeInMinutes: 60
      }
    })

    const hashedPassword = await new BcryptAdapter(12).hash(password)
    await db.accounts.create({
      data: {
        name: 'any_name',
        email: generalAdminEmail,
        hashedPassword,
        role: RoleEnum.GENERAL_ADMIN
      }
    })

    await db.accounts.create({
      data: {
        name: 'any_name',
        email: companyAdminEmail,
        hashedPassword,
        companyId: createdCompany.id,
        role: RoleEnum.COMPANY_ADMIN
      }
    })
  })

  afterAll(async () => {
    const deleteCompanies = db.companies.deleteMany()
    const deleteServiceHours = db.serviceHours.deleteMany()
    const deleteAccounts = db.accounts.deleteMany()
    await db.$transaction([
      deleteAccounts,
      deleteServiceHours,
      deleteCompanies,
      deleteAccounts
    ])
    await db.$disconnect()
  })

  afterEach(async () => {
    const deleteCompanies = db.companies.deleteMany()
    const deleteServiceHours = db.serviceHours.deleteMany()
    const deleteAccounts = db.accounts.deleteMany()
    await db.$transaction([
      deleteAccounts,
      deleteServiceHours,
      deleteCompanies,
      deleteAccounts
    ])
  })

  describe('GET /service-hour', () => {
    it('should return 200 on GET /service-hour', async () => {
      await db.serviceHours.create({
        data: {
          companyId: createdCompany.id as string,
          startTime: '09:00',
          endTime: '12:00',
          weekday: 0
        }
      })

      await request(app)
        .get(`/api/service-hour?companyId=${createdCompany.id}&weekday=${0}`)
        .expect(200)
    })
  })
})
