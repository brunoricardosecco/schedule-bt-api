import request from 'supertest'
import { db } from '@/infra/db/orm/prisma'
import app from '@/main/config/app'
import { AddServiceHourModel } from '@/domain/usecases/add-service-hour'
import { AddCompanyModel } from '@/domain/usecases/add-company'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { RoleEnum } from '@/domain/enums/role-enum'

const makeFakeServiceHourData = (companyId: string): AddServiceHourModel => ({
  companyId,
  startTime: '09:00',
  endTime: '12:00',
  weekday: 0
})

const makeFakeCompanyData = (): AddCompanyModel => ({
  name: 'verona',
  reservationPrice: 60,
  reservationTimeInMinutes: 60
})

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
      deleteServiceHours,
      deleteCompanies,
      deleteAccounts
    ])
  })

  describe('POST /service-hour', () => {
    it('should return 200 on POST /service-hour', async () => {
      const company = await db.companies.create({
        data: makeFakeCompanyData()
      })

      await request(app)
        .post('/api/service-hour')
        .send(makeFakeServiceHourData(company.id))
        .expect(200)
    })
    it('should return 200 on GET /service-hour', async () => {
      const loginResponse = await request(app)
        .post('/api/authenticate-by-password')
        .send({
          email: companyAdminEmail,
          password
        })

      await request(app)
        .get('/api/service-hour')
        .set('Authorization', `Bearer ${loginResponse.body.accessToken as string}`)
        .expect(200)
    })
  })
})
