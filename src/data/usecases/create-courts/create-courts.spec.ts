
import { CreateCourtsRepository, LoadAccountByIdRepository, AccountModel, RoleEnum } from './create-courts.protocols'
import { CreateCourts } from './create-courts'

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  hashedPassword: 'hashed_password',
  role: RoleEnum.EMPLOYEE,
  companyId: 'company_id',
  company: null,
  emailValidationToken: null,
  emailValidationTokenExpiration: null,
  isConfirmed: false,
  createdAt: new Date(),
  updatedAt: new Date()
})

const makeLoadAccountByIdRepository = (): LoadAccountByIdRepository => {
  class LoadAccountByIdRepositoryStub implements LoadAccountByIdRepository {
    async loadById (): Promise<AccountModel | null> {
      return await new Promise(resolve => { resolve(makeFakeAccount()) })
    }
  }

  return new LoadAccountByIdRepositoryStub()
}

const makeCreateCourtsRepository = (): CreateCourtsRepository => {
  class CreateCourtsRepositoryStub implements CreateCourtsRepository {
    async createMany (): Promise<number> {
      return await new Promise(resolve => { resolve(1) })
    }
  }

  return new CreateCourtsRepositoryStub()
}

type SutTypes = {
  sut: CreateCourts
  addCompanyRepositoryStub: CreateCourtsRepository
  loadAccountByIdRepositoryStub: LoadAccountByIdRepository
}

const makeSut = (): SutTypes => {
  const addCompanyRepositoryStub = makeCreateCourtsRepository()
  const loadAccountByIdRepositoryStub = makeLoadAccountByIdRepository()
  const sut = new CreateCourts(loadAccountByIdRepositoryStub, addCompanyRepositoryStub)

  return {
    sut,
    addCompanyRepositoryStub,
    loadAccountByIdRepositoryStub
  }
}

describe('CreateCourts Usecase', () => {
  it('should return error if user is not found', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut()

    const account = makeFakeAccount()
    const courts = [{ name: 'Quadra 1' }]

    const loadAccountByIdSpy = jest.spyOn(loadAccountByIdRepositoryStub, 'loadById')

    loadAccountByIdSpy.mockReturnValueOnce(new Promise((resolve) => { resolve(null) }))

    const response = await sut.create(account.id, courts) as Error

    expect(loadAccountByIdSpy).toHaveBeenCalledWith(account.id)
    expect(response).toBeInstanceOf(Error)
    expect(response.message).toBe('Usuário não encontrado')
  })

  it('should create courts', async () => {
    const { sut, addCompanyRepositoryStub, loadAccountByIdRepositoryStub } = makeSut()

    const account = makeFakeAccount()
    const courts = [{ name: 'Quadra 1' }]

    const loadAccountByIdSpy = jest.spyOn(loadAccountByIdRepositoryStub, 'loadById')
    const createManySpy = jest.spyOn(addCompanyRepositoryStub, 'createMany')

    loadAccountByIdSpy.mockReturnValueOnce(new Promise((resolve) => { resolve(account) }))

    const response = await sut.create(account.id, courts)

    expect(loadAccountByIdSpy).toHaveBeenCalledWith(account.id)
    expect(createManySpy).toHaveBeenCalledWith([
      {
        name: courts[0].name,
        companyId: account.companyId
      }
    ])
    expect(response).toBe(courts.length)
  })
})
