import { Authenticate } from './authenticate'
import { AccountModel, Decrypter, LoadAccountByIdRepository, RoleEnum, TokenPayload } from './authenticate.protocols'

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
  updatedAt: new Date(),
})

const defaultPayload = { userId: '1' }
const defaultAccount: AccountModel = makeFakeAccount()

const makeLoadAccountByIdRepository = (): LoadAccountByIdRepository => {
  class LoadAccountByIdRepositoryStub implements LoadAccountByIdRepository {
    async loadById(): Promise<AccountModel | null> {
      return defaultAccount
    }
  }

  return new LoadAccountByIdRepositoryStub()
}

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt(): Promise<TokenPayload | null> {
      return defaultPayload
    }
  }

  return new DecrypterStub()
}

type SutTypes = {
  sut: Authenticate
  DecrypterStub: Decrypter
  LoadAccountByIdRepositoryStub: LoadAccountByIdRepository
}

const makeSut = (): SutTypes => {
  const DecrypterStub = makeDecrypter()
  const LoadAccountByIdRepositoryStub = makeLoadAccountByIdRepository()
  const sut = new Authenticate(DecrypterStub, LoadAccountByIdRepositoryStub)

  return {
    sut,
    DecrypterStub,
    LoadAccountByIdRepositoryStub,
  }
}

describe('Authenticate Usecase', () => {
  it('should return error if Decrypter returns null', async () => {
    const { sut, DecrypterStub } = makeSut()

    jest.spyOn(DecrypterStub, 'decrypt').mockResolvedValueOnce(null)

    const error = (await sut.auth('token')) as Error

    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('Token inválido')
  })

  it('should return error if User is not found', async () => {
    const { sut, LoadAccountByIdRepositoryStub } = makeSut()

    jest.spyOn(LoadAccountByIdRepositoryStub, 'loadById').mockResolvedValueOnce(null)

    const error = (await sut.auth('token')) as Error

    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('Usuário não encontrado')
  })

  it('should authenticate the user', async () => {
    const { sut, DecrypterStub, LoadAccountByIdRepositoryStub } = makeSut()
    const token = 'token'

    const decryptSpy = jest.spyOn(DecrypterStub, 'decrypt')
    const loadAccountByIdRepositorySpy = jest.spyOn(LoadAccountByIdRepositoryStub, 'loadById')

    const response = await sut.auth(token)

    expect(decryptSpy).toHaveBeenCalledWith(token)
    expect(loadAccountByIdRepositorySpy).toHaveBeenCalledWith(defaultPayload.userId)
    expect(response).toStrictEqual({
      user: defaultAccount,
    })
  })
})
