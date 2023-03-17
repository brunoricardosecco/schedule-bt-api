import { Authorize } from './authorize'
import {
  LoadAccountByIdRepository,
  AccountModel,
  RoleEnum
} from './authorize.protocols'

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

const defaultPayload: AccountModel = makeFakeAccount()

const makeLoadAccountByIdRepository = (): LoadAccountByIdRepository => {
  class LoadAccountByIdRepositoryStub implements LoadAccountByIdRepository {
    async loadById (): Promise<AccountModel | null> {
      return await new Promise(resolve => { resolve(defaultPayload) })
    }
  }

  return new LoadAccountByIdRepositoryStub()
}

type SutTypes = {
  sut: Authorize
  LoadAccountByIdRepositoryStub: LoadAccountByIdRepository
}

const makeSut = (): SutTypes => {
  const LoadAccountByIdRepositoryStub = makeLoadAccountByIdRepository()
  const sut = new Authorize(LoadAccountByIdRepositoryStub)

  return {
    sut,
    LoadAccountByIdRepositoryStub
  }
}

describe('Authorize Usecase', () => {
  it('should authorize the user', async () => {
    const { sut, LoadAccountByIdRepositoryStub } = makeSut()

    const userId = 'userId'
    const authorizedRoles = [RoleEnum.EMPLOYEE]

    const loadAccountByIdRepositorySpy = jest.spyOn(LoadAccountByIdRepositoryStub, 'loadById')

    const response = await sut.authorize(userId, authorizedRoles)

    expect(loadAccountByIdRepositorySpy).toHaveBeenCalledWith(userId)
    expect(response).toBe(true)
  })

  it('should return error if user is not found', async () => {
    const { sut, LoadAccountByIdRepositoryStub } = makeSut()

    const userId = 'userId'
    const authorizedRoles = [RoleEnum.EMPLOYEE]

    jest.spyOn(LoadAccountByIdRepositoryStub, 'loadById').mockReturnValueOnce(new Promise((resolve) => { resolve(null) }))

    const error = await sut.authorize(userId, authorizedRoles) as Error

    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('User not found')
  })
})
