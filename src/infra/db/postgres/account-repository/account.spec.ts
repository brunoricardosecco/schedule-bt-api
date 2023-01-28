import { db } from '../../orm/prisma'
import { AccountPostgresRepository } from './account'

describe('Account Postgres Repository', () => {
  beforeAll(async () => {

  })

  afterAll(async () => {
    const deleteAccounts = db.account.deleteMany()
    await db.$transaction([
      deleteAccounts
    ])
    await db.$disconnect()
  })

  it('should return an account on success', async () => {
    const sut = new AccountPostgresRepository()
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })
})
