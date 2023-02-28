import { db } from '@/infra/db/orm/prisma'
import { AccountPostgresRepository } from './account-prostgres-repository'

const makeSut = (): AccountPostgresRepository => {
  return new AccountPostgresRepository()
}

describe('Account Postgres Repository', () => {
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

  it('should return an account on add success', async () => {
    const sut = makeSut()
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@mail.com',
      hashedPassword: 'any_password'
    })

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.hashedPassword).toBe('any_password')
  })

  it('should return an account on loadByEmail success', async () => {
    const sut = makeSut()
    await db.accounts.create({
      data: {
        email: 'any_email@mail.com',
        name: 'any_name',
        hashedPassword: 'any_password'
      }
    })
    const account = await sut.loadByEmail('any_email@mail.com')

    expect(account).toBeTruthy()
    expect(account?.id).toBeTruthy()
    expect(account?.name).toBe('any_name')
    expect(account?.email).toBe('any_email@mail.com')
    expect(account?.hashedPassword).toBe('any_password')
  })

  it('should return null on loadByEmail fails', async () => {
    const sut = makeSut()
    const account = await sut.loadByEmail('any_email@mail.com')

    expect(account).toBeFalsy()
  })
})
