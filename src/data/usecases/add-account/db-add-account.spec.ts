import { AddAccountModel, Hasher, AccountModel, AddAccountRepository } from './db-add-account.protocols'
import { DbAddAccount } from './db-add-account'
import { RoleEnum } from '@/domain/enums/role-enum'

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  hashedPassword: 'hashed_password',
  role: RoleEnum.EMPLOYEE,
  companyId: null,
  company: null,
  emailValidationToken: null,
  emailValidationTokenExpiration: null,
  isConfirmed: false,
  createdAt: new Date(),
  updatedAt: new Date()
})

const makeFakeAccountData = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password',
  companyId: 'valid_company_id',
  role: RoleEnum.EMPLOYEE
})

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (): Promise<AccountModel> {
      return await new Promise(resolve => { resolve(makeFakeAccount()) })
    }
  }

  return new AddAccountRepositoryStub()
}

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await new Promise(resolve => { resolve('hashed_password') })
    }
  }

  return new HasherStub()
}

type SutTypes = {
  sut: DbAddAccount
  HasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
  const HasherStub = makeHasher()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(HasherStub, addAccountRepositoryStub)

  return {
    sut,
    HasherStub,
    addAccountRepositoryStub
  }
}

describe('DbAddAccount Usecase', () => {
  it('should return error if role is different than EMPLOYEE or COMPANY_ADMIN', async () => {
    const { sut } = makeSut()

    const error = await sut.add({
      ...makeFakeAccountData(),
      role: RoleEnum.CLIENT
    }) as Error

    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('Role must be EMPLOYEE or COMPANY_ADMIN')
  })

  it('should call Hasher with correct password', async () => {
    const { sut, HasherStub } = makeSut()

    const hashSpy = jest.spyOn(HasherStub, 'hash')

    await sut.add(makeFakeAccountData())

    expect(hashSpy).toHaveBeenCalledWith('valid_password')
  })

  it('should throw if Hasher throws', async () => {
    const { sut, HasherStub } = makeSut()

    jest.spyOn(HasherStub, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))

    const promise = sut.add(makeFakeAccountData())

    await expect(promise).rejects.toThrow()
  })

  it('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    await sut.add(makeFakeAccountData())

    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      hashedPassword: 'hashed_password',
      companyId: 'valid_company_id',
      role: RoleEnum.EMPLOYEE
    })
  })

  it('should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))

    const promise = sut.add(makeFakeAccountData())

    await expect(promise).rejects.toThrow()
  })

  it('should returns an account on success', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    const expectedResult = makeFakeAccount()

    jest.spyOn(addAccountRepositoryStub, 'add').mockResolvedValueOnce(expectedResult)
    const account = await sut.add(makeFakeAccountData())

    expect(account).toEqual(expectedResult)
  })
})
