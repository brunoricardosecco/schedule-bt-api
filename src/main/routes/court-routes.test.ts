import { RoleEnum } from '@/domain/enums/role-enum'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { db } from '@/infra/db/orm/prisma'
import app from '@/main/config/app'
import request from 'supertest'

describe('Court Routes', () => {
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

    await db.courts.create({
      data: {
        id: 'id_01',
        name: 'any court name',
        companyId: 'company_id_01'
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

  describe('DELETE /court/:courtId', () => {
    it('should return 204 on DELETE /court/:courtId', async () => {
      const loginResponse = await request(app)
        .post('/api/authenticate-by-password')
        .send({
          email,
          password
        })

      await request(app)
        .delete('/api/court/id_01')
        .set('Authorization', `Bearer ${loginResponse.body.accessToken as string}`)
        .expect(204)
    })

    it('should return 404 on DELETE /court/:courtId if court not exists', async () => {
      const loginResponse = await request(app)
        .post('/api/authenticate-by-password')
        .send({
          email,
          password
        })

      await request(app)
        .delete('/api/court/non_existent_id')
        .set('Authorization', `Bearer ${loginResponse.body.accessToken as string}`)
        .expect(404)
    })
  })
})
