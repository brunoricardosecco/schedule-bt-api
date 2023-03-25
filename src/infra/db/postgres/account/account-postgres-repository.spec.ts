import { RoleEnum } from '@/domain/enums/role-enum'
import { db } from '@/infra/db/orm/prisma'
import { AccountPostgresRepository } from './account-postgres-repository'

const makeSut = (): AccountPostgresRepository => {
  return new AccountPostgresRepository()
}

describe('Account Postgres Repository', () => {
  let createdCompany

  beforeAll(async () => {
    createdCompany = await db.companies.create({
      data: {
        name: 'Empresa X',
        reservationPrice: 70,
        reservationTimeInMinutes: 60
      }
    })
  })

  beforeEach(async () => {
    const deleteAccounts = db.accounts.deleteMany()

    await db.$transaction([
      deleteAccounts
    ])
    await db.$disconnect()
  })

  afterAll(async () => {
    const deleteAccounts = db.accounts.deleteMany()
    const deleteCompanyId = db.companies.delete({
      where: {
        id: createdCompany.id
      }
    })

    await db.$transaction([
      deleteCompanyId,
      deleteAccounts
    ])
    await db.$disconnect()
  })

  describe('add', () => {
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
  })

  describe('loadByEmail', () => {
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
      expect(account?.companyId).toBe(createdCompany.id)
      expect(account?.role).toBe(RoleEnum.EMPLOYEE)
    })

    it('should return null on loadByEmail fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail('invalid_email@mail.com')

      expect(account).toBeNull()
    })
  })

  describe('loadById', () => {
    it('should return an account on loadById success', async () => {
      const sut = makeSut()
      const createdAccount = await db.accounts.create({
        data: {
          email: 'any_email2@mail.com',
          name: 'any_name',
          hashedPassword: 'any_password',
          companyId: createdCompany.id,
          role: RoleEnum.EMPLOYEE
        }
      })
      const account = await sut.loadById(createdAccount.id)

      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe('any_name')
      expect(account?.email).toBe('any_email2@mail.com')
      expect(account?.hashedPassword).toBe('any_password')
      expect(account?.companyId).toBe(createdCompany.id)
      expect(account?.role).toBe(RoleEnum.EMPLOYEE)
    })

    it('should return null on loadById fails', async () => {
      const sut = makeSut()
      const account = await sut.loadById('invalid_id')

      expect(account).toBeNull()
    })
  })
})
