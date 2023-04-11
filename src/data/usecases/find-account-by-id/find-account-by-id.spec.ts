import { FindAccountById } from './find-account-by-id'
import {
  AccountModel,
  Company,
  IFindAccountById,
  LoadAccountByIdRepository,
  RoleEnum,
} from './find-account-by-id.protocols'

const makeFakeCompany = (): Company => ({
  id: 'valid_id',
  name: 'verona',
  reservationPrice: 60,
  reservationTimeInMinutes: 60,
  createdAt: new Date(),
  updatedAt: new Date(),
})

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  hashedPassword: 'hashed_password',
  role: RoleEnum.EMPLOYEE,
  companyId: null,
  company: makeFakeCompany(),
  emailValidationToken: null,
  emailValidationTokenExpiration: null,
  isConfirmed: false,
  createdAt: new Date(),
  updatedAt: new Date(),
})

const makeLoadAccountByIdRepository = (): LoadAccountByIdRepository => {
  class LoadAccountByIdRepositoryStub implements LoadAccountByIdRepository {
    async loadById(id: string): Promise<AccountModel> {
      const fakeAccount = makeFakeAccount()
      return await Promise.resolve(fakeAccount)
    }
  }

  return new LoadAccountByIdRepositoryStub()
}

type SutTypes = {
  sut: IFindAccountById
  loadAccountByIdRepositoryStub: LoadAccountByIdRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByIdRepositoryStub = makeLoadAccountByIdRepository()
  const sut = new FindAccountById(loadAccountByIdRepositoryStub)

  return {
    sut,
    loadAccountByIdRepositoryStub,
  }
}

describe('FindAccount', () => {
  it('should call LoadAccountByIdRepository with correct values', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadAccountByIdRepositoryStub, 'loadById')
    await sut.findById('any_id')

    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })

  it('should throw an exception if LoadAccountByIdRepository throws an expection', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByIdRepositoryStub, 'loadById').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.findById('any_id')

    await expect(promise).rejects.toThrow()
  })

  it('should return account on success', async () => {
    const { sut } = makeSut()
    const fakeAccount = makeFakeAccount()
    const { hashedPassword, ...fakeAccountWithoutPassword } = fakeAccount
    const account = await sut.findById('valid_id')

    expect(account).toEqual(fakeAccountWithoutPassword)
  })
})
