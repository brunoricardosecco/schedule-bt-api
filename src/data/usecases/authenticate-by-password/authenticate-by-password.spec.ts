import { RoleEnum } from '@/domain/enums/role-enum'
import { AuthenticateByPassword } from './authenticate-by-password'
import {
  AccountModel,
  Encrypter,
  HashComparer,
  LoadAccountByEmailRepository,
  TAuthenticateByPasswordParams,
} from './authenticate-by-password.protocols'

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  hashedPassword: 'hashed_password',
  role: RoleEnum.CLIENT,
  companyId: null,
  company: null,
  emailValidationToken: null,
  emailValidationTokenExpiration: null,
  isConfirmed: false,
  createdAt: new Date(),
  updatedAt: new Date(),
})

const makeFakeAuthenticate = (): TAuthenticateByPasswordParams => ({
  email: 'any_email@mail.com',
  password: 'any_password',
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<AccountModel> {
      return await new Promise(resolve => {
        resolve(makeFakeAccount())
      })
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async isEqual(value: string, hash: string): Promise<boolean> {
      return await new Promise(resolve => {
        resolve(true)
      })
    }
  }
  return new HashComparerStub()
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return await new Promise(resolve => {
        resolve('any_token')
      })
    }
  }

  return new EncrypterStub()
}

type SutTypes = {
  sut: AuthenticateByPassword
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  EncrypterStub: Encrypter
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hashComparerStub = makeHashComparer()
  const EncrypterStub = makeEncrypter()
  const sut = new AuthenticateByPassword(loadAccountByEmailRepositoryStub, hashComparerStub, EncrypterStub)

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    EncrypterStub,
  }
}

describe('AuthenticateByPassword Usecase', () => {
  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')

    await sut.auth(makeFakeAuthenticate())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(
      new Promise((resolve, reject) => {
        reject(new Error())
      })
    )

    const promise = sut.auth(makeFakeAuthenticate())
    await expect(promise).rejects.toThrow()
  })

  it('should returns null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(
      new Promise(resolve => {
        resolve(null)
      })
    )

    const accessToken = await sut.auth(makeFakeAuthenticate())
    expect(accessToken).toBe(null)
  })

  it('should call HashCompare with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const isEqualSpy = jest.spyOn(hashComparerStub, 'isEqual')

    await sut.auth(makeFakeAuthenticate())
    expect(isEqualSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  it('should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'isEqual').mockReturnValueOnce(
      new Promise((resolve, reject) => {
        reject(new Error())
      })
    )

    const promise = sut.auth(makeFakeAuthenticate())
    await expect(promise).rejects.toThrow()
  })

  it('should returns null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'isEqual').mockReturnValueOnce(
      new Promise(resolve => {
        resolve(false)
      })
    )

    const accessToken = await sut.auth(makeFakeAuthenticate())
    expect(accessToken).toBe(null)
  })

  it('should call Encrypter with correct id', async () => {
    const { sut, EncrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(EncrypterStub, 'encrypt')

    await sut.auth(makeFakeAuthenticate())
    expect(encryptSpy).toHaveBeenCalledWith('valid_id')
  })

  it('should throw if Encrypter throws', async () => {
    const { sut, EncrypterStub } = makeSut()
    jest.spyOn(EncrypterStub, 'encrypt').mockReturnValueOnce(
      new Promise((resolve, reject) => {
        reject(new Error())
      })
    )

    const promise = sut.auth(makeFakeAuthenticate())
    await expect(promise).rejects.toThrow()
  })

  it('should call Encrypter with correct id', async () => {
    const { sut } = makeSut()

    const accessToken = await sut.auth(makeFakeAuthenticate())
    expect(accessToken).toBe('any_token')
  })
})
