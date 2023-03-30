import request from 'supertest'
import { db } from '@/infra/db/orm/prisma'
import app from '@/main/config/app'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { RoleEnum } from '@/domain/enums/role-enum'

describe('Court Routes', () => {
  const password = 'password'
  const email = 'email@mail.com'
  let createdCompany
  let createdAccount

  beforeAll(async () => {
    createdCompany = await db.companies.create({
      data: {
        name: 'Empresa X',
        reservationPrice: 70,
        reservationTimeInMinutes: 60
      }
    })

    const hashedPassword = await new BcryptAdapter(12).hash(password)
    createdAccount = await db.accounts.create({
      data: {
        name: 'any_name',
        email,
        hashedPassword,
        companyId: createdCompany.id,
        role: RoleEnum.COMPANY_ADMIN
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
    await db.accounts.delete({
      where: {
        id: createdAccount.id
      }
    })
  })

  describe('POST /court/bulk', () => {
    it('should return 200 on POST /court/bulk', async () => {
      const loginResponse = await request(app)
        .post('/api/authenticate-by-password')
        .send({
          email,
          password
        })

      await request(app)
        .post('/api/court/bulk')
        .set('Authorization', `Bearer ${loginResponse.body.accessToken as string}`)
        .send({
          courts: [
            {
              name: 'Quadra 1'
            },
            {
              name: 'Quadra 2'
            }
          ]
        })
        .expect(200)
    })
  })
})
