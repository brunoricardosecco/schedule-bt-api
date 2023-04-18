import { mockDecrypter } from '@/test/data/cryptography/mock-cryptography'
import { mockLoadAccountByIdRepository } from '@/test/data/db/mock-db-account'
import { mockAccount } from '@/test/domain/models/mock-account'
import { Authenticate } from './authenticate'
import { Decrypter, LoadAccountByIdRepository } from './authenticate.protocols'

type SutTypes = {
  sut: Authenticate
  DecrypterStub: Decrypter
  LoadAccountByIdRepositoryStub: LoadAccountByIdRepository
}

const makeSut = (): SutTypes => {
  const DecrypterStub = mockDecrypter()
  const LoadAccountByIdRepositoryStub = mockLoadAccountByIdRepository()
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
    const userId = '1'
    const decryptSpy = jest.spyOn(DecrypterStub, 'decrypt')
    const loadAccountByIdRepositorySpy = jest.spyOn(LoadAccountByIdRepositoryStub, 'loadById')
    const response = await sut.auth(token)

    expect(decryptSpy).toHaveBeenCalledWith(token)
    expect(loadAccountByIdRepositorySpy).toHaveBeenCalledWith(userId)
    expect(response).toStrictEqual({ user: mockAccount() })
  })
})
