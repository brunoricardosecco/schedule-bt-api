import request from 'supertest'
import { db } from '../../infra/db/orm/prisma'
import { hash } from 'bcrypt'
import app from '../config/app'

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
      await request(app)
        .post('/api/signup')
        .send({
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        })
        .expect(200)
    })
  })

  describe('POST /login', () => {
    it('should return 200 on login', async () => {
      const password = await hash('any_password', 12)
      await db.accounts.create({
        data: {
          name: 'any_name',
          email: 'any_email@mail.com',
          password
        }
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'any_email@mail.com',
          password: 'any_password'
        })
        .expect(200)
    })
  })
})
