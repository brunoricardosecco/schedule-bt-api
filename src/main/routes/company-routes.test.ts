import request from 'supertest'
import { db } from '@/infra/db/orm/prisma'
import app from '@/main/config/app'
import { AddCompanyModel } from '@/domain/usecases/add-company'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { RoleEnum } from '@/domain/enums/role-enum'

const makeFakeCompanyData = (): AddCompanyModel => ({
  name: 'verona',
  reservationPrice: 60,
  reservationTimeInMinutes: 60
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
    await db.courts.deleteMany()
    await db.accounts.deleteMany()
    await db.companies.deleteMany()
    // await db.$executeRawUnsafe('TRUNCATE TABLE "Companies" CASCADE;')
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
})
