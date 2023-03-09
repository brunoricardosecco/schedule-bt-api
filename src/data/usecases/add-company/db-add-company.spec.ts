import { AddCompanyModel, Company, AddCompanyRepository } from './db-add-company.protocols'
import { DbAddCompany } from './db-add-company'

const makeFakeCompany = (): Company => ({
  id: 'valid_id',
  name: 'verona',
  reservationPrice: 60,
  reservationTimeInMinutes: 60,
  createdAt: new Date(),
  updatedAt: new Date()
})

const makeFakeCompanyData = (): AddCompanyModel => ({
  name: 'verona',
  reservationPrice: 60,
  reservationTimeInMinutes: 60
})

const makeAddCompanyRepository = (): AddCompanyRepository => {
  class AddCompanyRepositoryStub implements AddCompanyRepository {
    async add (accountData: AddCompanyModel): Promise<Company> {
      return await new Promise(resolve => { resolve(makeFakeCompany()) })
    }
  }

  return new AddCompanyRepositoryStub()
}

type SutTypes = {
  sut: DbAddCompany
  addCompanyRepositoryStub: AddCompanyRepository
}

const makeSut = (): SutTypes => {
  const addCompanyRepositoryStub = makeAddCompanyRepository()
  const sut = new DbAddCompany(addCompanyRepositoryStub)

  return {
    sut,
    addCompanyRepositoryStub
  }
}

describe('DbAddCompany Usecase', () => {
  it('should call AddCompanyRepository with correct values', async () => {
    const { sut, addCompanyRepositoryStub } = makeSut()

    const companyData = makeFakeCompanyData()

    const addSpy = jest.spyOn(addCompanyRepositoryStub, 'add')

    await sut.add(companyData)

    expect(addSpy).toHaveBeenCalledWith(companyData)
  })

  it('should throw if AddCompanyRepository throws', async () => {
    const { sut, addCompanyRepositoryStub } = makeSut()

    jest.spyOn(addCompanyRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))

    const promise = sut.add(makeFakeCompanyData())

    await expect(promise).rejects.toThrow()
  })

  it('should returns and account on success', async () => {
    const { sut } = makeSut()

    const account = await sut.add(makeFakeCompanyData())

    expect(account).toEqual(makeFakeCompany())
  })
})
