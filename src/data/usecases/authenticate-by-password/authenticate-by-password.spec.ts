import { mockEncrypter, mockHashComparer } from '@/test/data/cryptography/mock-cryptography'
import { mockLoadAccountByEmailRepository } from '@/test/data/db/mock-db-account'
import { mockAuthenticateByPasswordParams } from '@/test/domain/usecases/mock-authenticate-by-password'
import { AuthenticateByPassword } from './authenticate-by-password'
import { Encrypter, HashComparer, LoadAccountByEmailRepository } from './authenticate-by-password.protocols'

type SutTypes = {
  sut: AuthenticateByPassword
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  EncrypterStub: Encrypter
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
  const hashComparerStub = mockHashComparer()
  const EncrypterStub = mockEncrypter()
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
    await sut.auth(mockAuthenticateByPasswordParams())

    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockRejectedValueOnce(new Error())
    const promise = sut.auth(mockAuthenticateByPasswordParams())

    await expect(promise).rejects.toThrow()
  })

  it('should returns null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(null)
    const accessToken = await sut.auth(mockAuthenticateByPasswordParams())

    expect(accessToken).toBe(null)
  })

  it('should call HashCompare with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const isEqualSpy = jest.spyOn(hashComparerStub, 'isEqual')
    await sut.auth(mockAuthenticateByPasswordParams())

    expect(isEqualSpy).toHaveBeenCalledWith('any_password', 'any_hashed_password')
  })

  it('should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'isEqual').mockRejectedValueOnce(new Error())
    const promise = sut.auth(mockAuthenticateByPasswordParams())

    await expect(promise).rejects.toThrow()
  })

  it('should returns null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'isEqual').mockResolvedValueOnce(false)
    const accessToken = await sut.auth(mockAuthenticateByPasswordParams())

    expect(accessToken).toBe(null)
  })

  it('should call Encrypter with correct id', async () => {
    const { sut, EncrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(EncrypterStub, 'encrypt')
    await sut.auth(mockAuthenticateByPasswordParams())

    expect(encryptSpy).toHaveBeenCalledWith('any_id')
  })

  it('should throw if Encrypter throws', async () => {
    const { sut, EncrypterStub } = makeSut()
    jest.spyOn(EncrypterStub, 'encrypt').mockRejectedValueOnce(new Error())
    const promise = sut.auth(mockAuthenticateByPasswordParams())

    await expect(promise).rejects.toThrow()
  })

  it('should call Encrypter with correct id', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(mockAuthenticateByPasswordParams())

    expect(accessToken).toBe('any_token')
  })
})
