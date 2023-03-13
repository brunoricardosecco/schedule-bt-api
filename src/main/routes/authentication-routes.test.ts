import request from 'supertest'
import { db } from '@/infra/db/orm/prisma'
import { hash } from 'bcrypt'
import app from '@/main/config/app'
import { RoleEnum } from '@/domain/enums/role-enum'

describe('Login Routes', () => {
  afterAll(async () => {
    const deleteAccounts = db.accounts.deleteMany()
    await db.$transaction([
      deleteAccounts
    ])
    await db.$disconnect()
  })

  afterEach(async () => {
    const deleteAccounts = db.accounts.deleteMany()
    await db.$transaction([
      deleteAccounts
    ])
  })

  describe('POST /signup', () => {
    it('should return 200 on signup', async () => {
      const createdCompany = await db.companies.create({
        data: {
          name: 'Empresa X',
          reservationPrice: 70,
          reservationTimeInMinutes: 60
        }
      })

      await request(app)
        .post('/api/signup')
        .send({
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password',
          passwordConfirmation: 'any_password',
          companyId: createdCompany.id,
          role: RoleEnum.EMPLOYEE
        })
        .expect(200)
    })
  })

  describe('POST /authenticate-by-password', () => {
    it('should return 200 on authenticate by password', async () => {
      const password = await hash('any_password', 12)
      await db.accounts.create({
        data: {
          name: 'any_name',
          email: 'any_email@mail.com',
          hashedPassword: password
        }
      })
      await request(app)
        .post('/api/authenticate-by-password')
        .send({
          email: 'any_email@mail.com',
          password: 'any_password'
        })
        .expect(200)
    })

    it('should return 401 on authenticate by password', async () => {
      const password = await hash('any_password', 12)
      await db.accounts.create({
        data: {
          name: 'any_name',
          email: 'any_email@mail.com',
          hashedPassword: password
        }
      })
      await request(app)
        .post('/api/authenticate-by-password')
        .send({
          email: 'any_email@mail.com',
          password: 'wrong_password'
        })
        .expect(401)
    })
  })
})
