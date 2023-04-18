import { RoleEnum } from '@/domain/enums/role-enum'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { db } from '@/infra/db/orm/prisma'
import app from '@/main/config/app'
import { mockCompanyData } from '@/test/domain/models/mock-company'
import { mockServiceHourData } from '@/test/domain/models/mock-service-hour'
import request from 'supertest'

describe('Company Routes', () => {
  const password = 'password'
  const companyAdminEmail = 'company_admin@mail.com'
  const generalAdminEmail = 'general_admin@mail.com'
  let createdCompany

  beforeAll(async () => {
    createdCompany = await db.companies.create({
      data: {
        id: 'company_id_01',
        name: 'Empresa X',
        reservationPrice: 70,
        reservationTimeInMinutes: 60,
      },
    })

    const hashedPassword = await new BcryptAdapter(12).hash(password)
    await db.accounts.create({
      data: {
        name: 'any_name',
        email: generalAdminEmail,
        hashedPassword,
        role: RoleEnum.GENERAL_ADMIN,
      },
    })

    await db.accounts.create({
      data: {
        name: 'any_name',
        email: companyAdminEmail,
        hashedPassword,
        companyId: createdCompany.id,
        role: RoleEnum.COMPANY_ADMIN,
      },
    })

    await db.courts.create({
      data: {
        id: 'id_01',
        name: 'any court name',
        companyId: 'company_id_01',
      },
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
      const loginResponse = await request(app).post('/api/authenticate-by-password').send({
        email: generalAdminEmail,
        password,
      })

      await request(app)
        .post('/api/company')
        .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
        .send(mockCompanyData())
        .expect(200)
    })
  })

  describe('GET /company/court', () => {
    it('should return 200 on GET /company/court', async () => {
      const loginResponse = await request(app).post('/api/authenticate-by-password').send({
        email: companyAdminEmail,
        password,
      })

      await request(app)
        .get('/api/company/court')
        .set('Authorization', `Bearer ${loginResponse.body.accessToken as string}`)
        .expect(200)
    })
  })

  describe('POST /company/service-hour', () => {
    it('should return 200 on POST /company/service-hour', async () => {
      const loginResponse = await request(app).post('/api/authenticate-by-password').send({
        email: companyAdminEmail,
        password,
      })
      const company = await db.companies.create({
        data: mockCompanyData(),
      })

      await request(app)
        .post('/api/company/service-hour')
        .set('Authorization', `Bearer ${loginResponse.body.accessToken as string}`)
        .send(mockServiceHourData({ companyId: company.id }))
        .expect(200)
    })
  })

  describe('GET /company/service-hour', () => {
    it('should return 200 on GET /company/service-hour', async () => {
      const loginResponse = await request(app).post('/api/authenticate-by-password').send({
        email: companyAdminEmail,
        password,
      })

      await request(app)
        .get('/api/company/service-hour')
        .set('Authorization', `Bearer ${loginResponse.body.accessToken as string}`)
        .expect(200)
    })
  })

  describe('PATCH /company/court/:courtId', () => {
    it('should return 200 on PATCH /company/court/:courtId', async () => {
      const loginResponse = await request(app).post('/api/authenticate-by-password').send({
        email: companyAdminEmail,
        password,
      })

      await request(app)
        .patch('/api/company/court/id_01')
        .set('Authorization', `Bearer ${loginResponse.body.accessToken as string}`)
        .send({
          name: 'updated_name',
        })
        .expect(200)
    })

    it('should return 404 on PATCH /company/court/:courtId if court not exists', async () => {
      const loginResponse = await request(app).post('/api/authenticate-by-password').send({
        email: companyAdminEmail,
        password,
      })

      await request(app)
        .patch('/api/company/court/non_existent_id')
        .set('Authorization', `Bearer ${loginResponse.body.accessToken as string}`)
        .send({
          name: 'updated_name',
        })
        .expect(404)
    })
  })
  describe('GET /company/reservation-slots', () => {
    it('should return 200 on GET /company/reservation-slots', async () => {
      const loginResponse = await request(app).post('/api/authenticate-by-password').send({
        email: companyAdminEmail,
        password,
      })

      await db.serviceHours.create({
        data: {
          startTime: '09:00',
          endTime: '12:00',
          weekday: new Date().getDay(),
          companyId: createdCompany.id,
        },
      })

      await request(app)
        .get(`/api/company/reservation-slots?date=${new Date()}`)
        .set('Authorization', `Bearer ${loginResponse.body.accessToken as string}`)
        .expect(200)
    })
  })
})
