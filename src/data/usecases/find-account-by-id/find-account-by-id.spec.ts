import { mockLoadAccountByIdRepository } from '@/test/data/db/mock-db-account'
import { mockAccount } from '@/test/domain/models/mock-account'
import { FindAccountById } from './find-account-by-id'
import { IFindAccountById, LoadAccountByIdRepository } from './find-account-by-id.protocols'

type SutTypes = {
  sut: IFindAccountById
  loadAccountByIdRepositoryStub: LoadAccountByIdRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByIdRepositoryStub = mockLoadAccountByIdRepository()
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
    jest.spyOn(loadAccountByIdRepositoryStub, 'loadById').mockRejectedValueOnce(new Error())
    const promise = sut.findById('any_id')

    await expect(promise).rejects.toThrow()
  })

  it('should return account on success', async () => {
    const { sut } = makeSut()
    const { hashedPassword, ...fakeAccountWithoutPassword } = mockAccount()
    const account = await sut.findById('any_id')

    expect(account).toEqual(fakeAccountWithoutPassword)
  })
})
