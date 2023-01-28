import request from 'supertest'
import { db } from '../../infra/db/orm/prisma'
import app from '../config/app'

describe('SingUp Routes', () => {
  afterAll(async () => {
    const deleteAccounts = db.account.deleteMany()
    await db.$transaction([
      deleteAccounts
    ])
    await db.$disconnect()
  })

  afterEach(async () => {
    const deleteAccounts = db.account.deleteMany()
    await db.$transaction([
      deleteAccounts
    ])
  })

  it('should return an account on success', async () => {
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