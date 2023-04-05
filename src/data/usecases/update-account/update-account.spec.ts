import { Hasher, AccountModel, UpdateAccountRepository } from './update-account.protocols'
import { UpdateAccount } from './update-account'
import { RoleEnum } from '@/domain/enums/role-enum'

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
  updatedAt: new Date()
})

const makeAccountRepository = (): UpdateAccountRepository => {
  class UpdateAccountRepositoryStub implements UpdateAccountRepository {
    async update (): Promise<AccountModel> {
      return makeFakeAccount('any_hashed_password')
    }
  }

  return new UpdateAccountRepositoryStub()
}

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (): Promise<string> {
      return 'hashed_password'
    }
  }

  return new HasherStub()
}

type SutTypes = {
  sut: UpdateAccount
  HasherStub: Hasher
  accountRepositoryStub: UpdateAccountRepository
}

const makeSut = (): SutTypes => {
  const HasherStub = makeHasher()
  const accountRepositoryStub = makeAccountRepository()
  const sut = new UpdateAccount(HasherStub, accountRepositoryStub)

  return {
    sut,
    HasherStub,
    accountRepositoryStub
  }
}

describe('UpdateAccount Usecase', () => {
  it('should return error if the password length is lower than the minimum', async () => {
    const { sut } = makeSut()

    const userId = 'valid_id'
    const password = 'a'

    const error = await sut.update(userId, { password }) as Error

    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('A senha deve possuir no mínimo 8 caracteres')
  })

  it('should return error if the password doesn`t contain at least one letter', async () => {
    const { sut } = makeSut()

    const userId = 'valid_id'
    const password = '12345678'

    const error = await sut.update(userId, { password }) as Error

    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('A senha deve possuir ao menos uma letra')
  })

  it('should return error if the password doesn`t contain at least one number', async () => {
    const { sut } = makeSut()

    const password = 'abcdefghijk'

    const userId = 'valid_id'
    const error = await sut.update(userId, { password }) as Error

    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('A senha deve possuir ao menos um número')
  })

  it('should throw if Hasher throws', async () => {
    const { sut, HasherStub } = makeSut()

    jest.spyOn(HasherStub, 'hash').mockRejectedValueOnce(new Error())

    const userId = 'valid_id'
    const password = 'rajsiad21i'
    const promise = sut.update(userId, { password })

    await expect(promise).rejects.toThrow()
  })

  it('should update account', async () => {
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
      password: 'rajsiad21i'
    }
    const account = await sut.update(userId, params) as AccountModel

    expect(hashSpy).toHaveBeenCalledWith(params.password)
    expect(updateSpy).toHaveBeenCalledWith(
      userId,
      {
        hashedPassword,
        name: params.name
      }
    )
    expect(account).toEqual(expectedResult)
    expect(account.hashedPassword).toEqual(hashedPassword)
  })
})
