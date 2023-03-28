
import { FindCourtsRepository, LoadAccountByIdRepository, AccountModel, RoleEnum, Court } from './find-courts.protocols'
import { FindCourts } from './find-courts'

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

const makeFindCourtsRepository = (): FindCourtsRepository => {
  class FindCourtsRepositoryStub implements FindCourtsRepository {
    async findMany (): Promise<Court[]> {
      return await new Promise(resolve => { resolve([]) })
    }
  }

  return new FindCourtsRepositoryStub()
}

type SutTypes = {
  sut: FindCourts
  findManyCourtsRepositoryStub: FindCourtsRepository
  loadAccountByIdRepositoryStub: LoadAccountByIdRepository
}

const makeSut = (): SutTypes => {
  const findManyCourtsRepositoryStub = makeFindCourtsRepository()
  const loadAccountByIdRepositoryStub = makeLoadAccountByIdRepository()
  const sut = new FindCourts(loadAccountByIdRepositoryStub, findManyCourtsRepositoryStub)

  return {
    sut,
    findManyCourtsRepositoryStub,
    loadAccountByIdRepositoryStub
  }
}

describe('FindCourts Usecase', () => {
  it('should return error if user is not found', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut()

    const account = makeFakeAccount()

    const loadAccountByIdSpy = jest.spyOn(loadAccountByIdRepositoryStub, 'loadById')

    loadAccountByIdSpy.mockResolvedValue(null)

    const response = await sut.findMany({ userId: account.id }) as Error

    expect(loadAccountByIdSpy).toHaveBeenCalledWith(account.id)
    expect(response).toBeInstanceOf(Error)
    expect(response.message).toBe('Usuário não encontrado')
  })

  it('should find all user courts', async () => {
    const { sut, findManyCourtsRepositoryStub, loadAccountByIdRepositoryStub } = makeSut()

    const account = makeFakeAccount()
    const courts = [
      {
        id: '1',
        name: 'Quadra 1',
        company: null,
        companyId: account.companyId as string,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Quadra 2',
        company: null,
        companyId: account.companyId as string,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    const loadAccountByIdSpy = jest.spyOn(loadAccountByIdRepositoryStub, 'loadById')
    const findManySpy = jest.spyOn(findManyCourtsRepositoryStub, 'findMany')

    loadAccountByIdSpy.mockResolvedValue(account)
    findManySpy.mockResolvedValue(courts)

    const response = await sut.findMany({ userId: account.id })

    expect(loadAccountByIdSpy).toHaveBeenCalledWith(account.id)
    expect(findManySpy).toHaveBeenCalledWith({
      companyId: account.companyId
    })
    expect(response).toStrictEqual(courts)
  })

  it('should find all courts', async () => {
    const { sut, findManyCourtsRepositoryStub } = makeSut()

    const account = makeFakeAccount()
    const courts = [
      {
        id: '1',
        name: 'Quadra 1',
        company: null,
        companyId: account.companyId as string,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Quadra 2',
        company: null,
        companyId: account.companyId as string,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    const findManySpy = jest.spyOn(findManyCourtsRepositoryStub, 'findMany')

    findManySpy.mockResolvedValue(courts)

    const response = await sut.findMany({})

    expect(findManySpy).toHaveBeenCalledWith({
      companyId: undefined
    })
    expect(response).toStrictEqual(courts)
  })
})
