import { LoadAccountByEmailRepository } from '@/data/usecases/authenticate-by-password/authenticate-by-password.protocols'
import { RoleEnum } from '@/domain/enums/role-enum'
import { mockHasher } from '@/test/data/cryptography/mock-cryptography'
import { mockAddAccountRepository, mockLoadAccountByEmailReturnNullRepository } from '@/test/data/db/mock-db-account'
import { mockAccount, mockAccountData } from '@/test/domain/models/mock-account'
import { DbAddAccount } from './db-add-account'
import { AddAccountRepository, Hasher } from './db-add-account.protocols'

type SutTypes = {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = mockHasher()
  const addAccountRepositoryStub = mockAddAccountRepository()
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailReturnNullRepository()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)

  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub,
  }
}

describe('DbAddAccount Usecase', () => {
  it('should return error if role is different than EMPLOYEE or COMPANY_ADMIN', async () => {
    const { sut } = makeSut()
    const error = (await sut.add({ ...mockAccountData(), role: RoleEnum.CLIENT })) as Error

    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('Role must be EMPLOYEE or COMPANY_ADMIN')
  })

  it('should return error if email is already being used', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(mockAccount())
    const error = (await sut.add(mockAccountData())) as Error

    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('Email already being used')
  })

  it('should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(mockAccountData())

    expect(hashSpy).toHaveBeenCalledWith('any_password')
  })

  it('should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockRejectedValueOnce(new Error())
    const promise = sut.add(mockAccountData())

    await expect(promise).rejects.toThrow()
  })

  it('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(mockAccountData())

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      hashedPassword: 'any_hashed_password',
      companyId: 'any_company_id',
      role: RoleEnum.EMPLOYEE,
    })
  })

  it('should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockRejectedValueOnce(new Error())
    const promise = sut.add(mockAccountData())

    await expect(promise).rejects.toThrow()
  })

  it('should returns an account on success', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const expectedResult = mockAccount()
    jest.spyOn(addAccountRepositoryStub, 'add').mockResolvedValueOnce(expectedResult)
    const account = await sut.add(mockAccountData())

    expect(account).toEqual(expectedResult)
  })
})
