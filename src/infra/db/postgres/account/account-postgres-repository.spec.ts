import { RoleEnum } from '@/domain/enums/role-enum'
import { db } from '@/infra/db/orm/prisma'
import { AccountPostgresRepository } from './account-postgres-repository'

const makeSut = (): AccountPostgresRepository => {
  return new AccountPostgresRepository()
}

describe('Account Postgres Repository', () => {
  let createdCompany

  beforeAll(async () => {
    const deleteAccounts = db.accounts.deleteMany()

    await db.$transaction([
      deleteAccounts
    ])
    await db.$disconnect()

    createdCompany = await db.companies.create({
      data: {
        name: 'Empresa X',
        reservationPrice: 70,
        reservationTimeInMinutes: 60
      }
    })
  })

  afterAll(async () => {
    const deleteAccounts = db.accounts.deleteMany()

    await db.$transaction([
      deleteAccounts
    ])
    await db.$disconnect()
  })

  it('should return an account on add success', async () => {
    const sut = makeSut()
    const params = {
      name: 'any_name',
      email: 'any_email@mail.com',
      hashedPassword: 'any_password',
      companyId: createdCompany.id,
      role: RoleEnum.EMPLOYEE
    }

    const account = await sut.add(params)

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe(params.name)
    expect(account.email).toBe(params.email)
    expect(account.hashedPassword).toBe(params.hashedPassword)
    expect(account.companyId).toBe(params.companyId)
    expect(account.role).toBe(params.role)
  })

  it('should return an account on loadByEmail success', async () => {
    const sut = makeSut()
    await db.accounts.create({
      data: {
        email: 'any_email2@mail.com',
        name: 'any_name',
        hashedPassword: 'any_password',
        companyId: createdCompany.id,
        role: RoleEnum.EMPLOYEE
      }
    })
    const account = await sut.loadByEmail('any_email2@mail.com')

    expect(account).toBeTruthy()
    expect(account?.id).toBeTruthy()
    expect(account?.name).toBe('any_name')
    expect(account?.email).toBe('any_email2@mail.com')
    expect(account?.hashedPassword).toBe('any_password')
  })

  it('should return null on loadByEmail fails', async () => {
    const sut = makeSut()
    const account = await sut.loadByEmail('invalid_email@mail.com')

    expect(account).toBeFalsy()
  })
})
