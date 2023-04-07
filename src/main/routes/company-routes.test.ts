import request from 'supertest'
import { db } from '@/infra/db/orm/prisma'
import app from '@/main/config/app'
import { AddCompanyModel } from '@/domain/usecases/add-company'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { RoleEnum } from '@/domain/enums/role-enum'
import { AddServiceHourModel } from '@/domain/usecases/add-service-hour'

const makeFakeCompanyData = (): AddCompanyModel => ({
  name: 'verona',
  reservationPrice: 60,
  reservationTimeInMinutes: 60
})

const makeFakeServiceHourData = (companyId: string): AddServiceHourModel => ({
  companyId,
  startTime: '09:00',
  endTime: '12:00',
  weekday: 0
})

describe('Company Routes', () => {
  const password = 'password'
  const companyAdminEmail = 'company_admin@mail.com'
  const generalAdminEmail = 'generala_dmin@mail.com'
  let createdCompany

  beforeAll(async () => {
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
    await db.accounts.deleteMany()
    await db.courts.deleteMany()
    await db.companies.deleteMany()
  })

  afterEach(async () => {
    await db.serviceHours.deleteMany()
  })

  describe('POST /company', () => {
    it('should return 200 on POST /company', async () => {
      const loginResponse = await request(app)
        .post('/api/authenticate-by-password')
        .send({
          email: generalAdminEmail,
          password
        })

      await request(app)
        .post('/api/company')
        .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
        .send(makeFakeCompanyData())
        .expect(200)
    })
  })

  describe('GET /company/court', () => {
    it('should return 200 on GET /company/court', async () => {
      const loginResponse = await request(app)
        .post('/api/authenticate-by-password')
        .send({
          email: companyAdminEmail,
          password
        })

      await request(app)
        .get('/api/company/court')
        .set('Authorization', `Bearer ${loginResponse.body.accessToken as string}`)
        .expect(200)
    })
  })
  describe('POST /company/service-hour', () => {
    it('should return 200 on POST /company/service-hour', async () => {
      const loginResponse = await request(app)
        .post('/api/authenticate-by-password')
        .send({
          email: companyAdminEmail,
          password
        })

      const company = await db.companies.create({
        data: makeFakeCompanyData()
      })

      await request(app)
        .post('/api/company/service-hour')
        .set('Authorization', `Bearer ${loginResponse.body.accessToken as string}`)
        .send(makeFakeServiceHourData(company.id))
        .expect(200)
    })
  })
  describe('GET /company/service-hour', () => {
    it('should return 200 on GET /company/service-hour', async () => {
      const loginResponse = await request(app)
        .post('/api/authenticate-by-password')
        .send({
          email: companyAdminEmail,
          password
        })

      await request(app)
        .get('/api/company/service-hour')
        .set('Authorization', `Bearer ${loginResponse.body.accessToken as string}`)
        .expect(200)
    })
  })
  describe('DELETE /company/service-hour/:serviceHourId', () => {
    it('should return 204 on DELETE /company/service-hour/:serviceHourId', async () => {
      const loginResponse = await request(app)
        .post('/api/authenticate-by-password')
        .send({
          email: companyAdminEmail,
          password
        })

      const serviceHour = await db.serviceHours.create({
        data: makeFakeServiceHourData(createdCompany.id)
      })

      await request(app)
        .delete(`/api/company/service-hour/${serviceHour.id}`)
        .set('Authorization', `Bearer ${loginResponse.body.accessToken as string}`)
        .expect(204)
    })
  })
  describe('GET /company/reservation-intervals', () => {
    it('should return 200 on GET /company/reservation-intervals', async () => {
      const loginResponse = await request(app)
        .post('/api/authenticate-by-password')
        .send({
          email: companyAdminEmail,
          password
        })

      await db.serviceHours.create({
        data: {
          startTime: '09:00',
          endTime: '12:00',
          weekday: new Date().getDay(),
          companyId: createdCompany.id
        }
      })

      await request(app)
        .get(`/api/company/reservation-intervals?date=${new Date()}`)
        .set('Authorization', `Bearer ${loginResponse.body.accessToken as string}`)
        .expect(200)
    })
  })
})
