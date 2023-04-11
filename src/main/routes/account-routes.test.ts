import { RoleEnum } from '@/domain/enums/role-enum'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { db } from '@/infra/db/orm/prisma'
import app from '@/main/config/app'
import request from 'supertest'

describe('Account Routes', () => {
  const name = 'Nome'
  const password = 'password'
  const accountEmail = 'account@mail.com'

  beforeAll(async () => {
    const hashedPassword = await new BcryptAdapter(12).hash(password)
    await db.accounts.create({
      data: {
        name,
        email: accountEmail,
        hashedPassword,
        role: RoleEnum.GENERAL_ADMIN,
      },
    })
  })

  afterAll(async () => {
    await db.accounts.deleteMany()
  })

  describe('PATCH /account', () => {
    it('should return 200 on PATCH /account', async () => {
      const loginResponse = await request(app).post('/api/authenticate-by-password').send({
        email: accountEmail,
        password,
      })

      await request(app)
        .patch('/api/account')
        .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
        .send({
          name: 'Novo Nome',
          password: '1235611AB',
          currentPassword: password,
        })
        .expect(200)
    })
  })
})
