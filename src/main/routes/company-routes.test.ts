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
  const email = 'email@mail.com'
  let createdAccount

  beforeAll(async () => {
    const hashedPassword = await new BcryptAdapter(12).hash(password)
    createdAccount = await db.accounts.create({
      data: {
        name: 'any_name',
        email,
        hashedPassword,
        role: RoleEnum.GENERAL_ADMIN
      }
    })
  })

  afterEach(async () => {
    await db.accounts.delete({
      where: {
        id: createdAccount.id
      }
    })
    await db.$executeRawUnsafe('TRUNCATE TABLE "Companies" CASCADE;')
  })

  describe('POST /company', () => {
    it('should return 200 on POST /company', async () => {
      const loginResponse = await request(app)
        .post('/api/authenticate-by-password')
        .send({
          email,
          password
        })

      await request(app)
        .post('/api/company')
        .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
        .send(makeFakeCompanyData())
        .expect(200)
    })
  })
})
