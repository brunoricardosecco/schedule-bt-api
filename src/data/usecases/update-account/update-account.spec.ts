import { RoleEnum } from '@/domain/enums/role-enum'
import { UpdateAccount } from './update-account'
import {
  AccountModel,
  HashComparer,
  Hasher,
  LoadAccountByIdRepository,
  UpdateAccountRepository,
} from './update-account.protocols'

const makeFakeAccount = (hashedPassword: string): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  hashedPassword: hashedPassword ?? '',
  role: RoleEnum.EMPLOYEE,
  companyId: null,
  company: null,
  emailValidationToken: null,
  emailValidationTokenExpiration: null,
  isConfirmed: false,
  createdAt: new Date(),
  updatedAt: new Date(),
})

const defaultAccount = makeFakeAccount('hashed_password')

const makeAccountRepository = (): UpdateAccountRepository & LoadAccountByIdRepository => {
  class AccountRepositoryStub implements UpdateAccountRepository, LoadAccountByIdRepository {
    async update(): Promise<AccountModel> {
      return makeFakeAccount('any_hashed_password')
    }

    async loadById(): Promise<AccountModel | null> {
      return defaultAccount
    }
  }

  return new AccountRepositoryStub()
}

const makeHasher = (): Hasher & HashComparer => {
  class HasherStub implements Hasher {
    async hash(): Promise<string> {
      return 'hashed_password'
    }

    async isEqual(): Promise<boolean> {
      return true
    }
  }

  return new HasherStub()
}

type SutTypes = {
  sut: UpdateAccount
  HasherStub: Hasher & HashComparer
  accountRepositoryStub: UpdateAccountRepository & LoadAccountByIdRepository
}

const makeSut = (): SutTypes => {
  const HasherStub = makeHasher()
  const accountRepositoryStub = makeAccountRepository()
  const sut = new UpdateAccount(HasherStub, accountRepositoryStub)

  return {
    sut,
    HasherStub,
    accountRepositoryStub,
  }
}

describe('UpdateAccount Usecase', () => {
  it('should return error if the password is sent but the currentPassword is not sent', async () => {
    const { sut } = makeSut()

    const userId = 'valid_id'
    const paramsToUpdate = {
      password: 'a',
    }

    const error = (await sut.update(userId, paramsToUpdate)) as Error

    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('É obrigatório envio da senha atual')
  })

  it('should return error if the currentPassword is incorrect', async () => {
    const { sut, HasherStub } = makeSut()

    const userId = 'valid_id'
    const paramsToUpdate = {
      password: 'a',
      currentPassword: 'any_password',
    }

    jest.spyOn(HasherStub, 'isEqual').mockResolvedValueOnce(false)

    const error = (await sut.update(userId, paramsToUpdate)) as Error

    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('Senha atual incorreta')
  })

  it('should return error if the password length is lower than the minimum', async () => {
    const { sut } = makeSut()

    const userId = 'valid_id'
    const paramsToUpdate = {
      password: 'a',
      currentPassword: '1234567AB',
    }

    const error = (await sut.update(userId, paramsToUpdate)) as Error

    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('A senha deve possuir no mínimo 8 caracteres')
  })

  it('should return error if the password doesn`t contain at least one letter', async () => {
    const { sut } = makeSut()

    const userId = 'valid_id'

    const paramsToUpdate = {
      password: '12345678',
      currentPassword: '1234567AB',
    }

    const error = (await sut.update(userId, paramsToUpdate)) as Error

    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('A senha deve possuir ao menos uma letra')
  })

  it('should return error if the password doesn`t contain at least one number', async () => {
    const { sut } = makeSut()

    const paramsToUpdate = {
      password: 'abcdefghijk',
      currentPassword: '1234567AB',
    }

    const userId = 'valid_id'
    const error = (await sut.update(userId, paramsToUpdate)) as Error

    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('A senha deve possuir ao menos um número')
  })

  it('should throw if Hasher throws', async () => {
    const { sut, HasherStub } = makeSut()

    jest.spyOn(HasherStub, 'hash').mockRejectedValueOnce(new Error())

    const userId = 'valid_id'
    const paramsToUpdate = {
      password: 'a',
      currentPassword: 'abcdefghijk1',
    }
    const promise = sut.update(userId, paramsToUpdate)

    await expect(promise).rejects.toThrow()
  })

  it('should update the name of the account', async () => {
    const { sut, accountRepositoryStub } = makeSut()

    const hashedPassword = 'hashed_password'
    const expectedResult = makeFakeAccount(hashedPassword)

    const updateSpy = jest.spyOn(accountRepositoryStub, 'update')

    updateSpy.mockResolvedValueOnce(expectedResult)

    const userId = 'valid_id'
    const params = {
      name: 'New name',
    }
    const account = (await sut.update(userId, params)) as AccountModel

    expect(updateSpy).toHaveBeenCalledWith(userId, {
      name: params.name,
    })
    expect(account).toEqual(expectedResult)
    expect(account.hashedPassword).toEqual(hashedPassword)
  })

  it('should update all the possible value of the account', async () => {
    const { sut, accountRepositoryStub, HasherStub } = makeSut()

    const hashedPassword = 'hashed_password'
    const expectedResult = makeFakeAccount(hashedPassword)

    const hashSpy = jest.spyOn(HasherStub, 'hash')
    const updateSpy = jest.spyOn(accountRepositoryStub, 'update')

    hashSpy.mockResolvedValueOnce(hashedPassword)
    updateSpy.mockResolvedValueOnce(expectedResult)

    const userId = 'valid_id'
    const params = {
      name: 'New name',
      currentPassword: 'abcdefghijk1',
      password: 'rajsiad21i',
    }
    const account = (await sut.update(userId, params)) as AccountModel

    expect(hashSpy).toHaveBeenCalledWith(params.password)
    expect(updateSpy).toHaveBeenCalledWith(userId, {
      hashedPassword,
      name: params.name,
    })
    expect(account).toEqual(expectedResult)
    expect(account.hashedPassword).toEqual(hashedPassword)
  })
})
