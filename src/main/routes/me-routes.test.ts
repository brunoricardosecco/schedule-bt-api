import { RoleEnum } from '@/domain/enums/role-enum'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { db } from '@/infra/db/orm/prisma'
import app from '@/main/config/app'
import request from 'supertest'

describe('Me Routes', () => {
  const password = 'password'
  const email = 'email@mail.com'
  let createdCompany
  let createdAccount

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
    createdAccount = await db.accounts.create({
      data: {
        name: 'any_name',
        email,
        hashedPassword,
        companyId: createdCompany.id,
        role: RoleEnum.COMPANY_ADMIN,
      },
    })
  })

  afterAll(async () => {
    await db.courts.deleteMany()
    await db.companies.delete({
      where: {
        id: createdCompany.id,
      },
    })
    await db.accounts.delete({
      where: {
        id: createdAccount.id,
      },
    })
  })

  describe('GET /me', () => {
    it('should return 200 on GET /me', async () => {
      const loginResponse = await request(app).post('/api/authenticate-by-password').send({
        email,
        password,
      })

      await request(app)
        .get('/api/me')
        .set('Authorization', `Bearer ${loginResponse.body.accessToken as string}`)
        .expect(200)
    })
  })
})
