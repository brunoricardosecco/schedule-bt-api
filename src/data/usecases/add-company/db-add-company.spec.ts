import { mockAddCompanyRepository } from '@/test/data/db/mock-db-company'
import { mockCompany, mockCompanyData } from '@/test/domain/models/mock-company'
import { DbAddCompany } from './db-add-company'
import { AddCompanyRepository } from './db-add-company.protocols'

type SutTypes = {
  sut: DbAddCompany
  addCompanyRepositoryStub: AddCompanyRepository
}

const makeSut = (): SutTypes => {
  const addCompanyRepositoryStub = mockAddCompanyRepository()
  const sut = new DbAddCompany(addCompanyRepositoryStub)

  return {
    sut,
    addCompanyRepositoryStub,
  }
}

describe('DbAddCompany Usecase', () => {
  it('should call AddCompanyRepository with correct values', async () => {
    const { sut, addCompanyRepositoryStub } = makeSut()
    const companyData = mockCompanyData()
    const addSpy = jest.spyOn(addCompanyRepositoryStub, 'add')
    await sut.add(companyData)

    expect(addSpy).toHaveBeenCalledWith(companyData)
  })

  it('should throw if AddCompanyRepository throws', async () => {
    const { sut, addCompanyRepositoryStub } = makeSut()
    jest.spyOn(addCompanyRepositoryStub, 'add').mockRejectedValueOnce(new Error())
    const promise = sut.add(mockCompanyData())

    await expect(promise).rejects.toThrow()
  })

  it('should returns and account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(mockCompanyData())

    expect(account).toEqual(mockCompany())
  })
})
