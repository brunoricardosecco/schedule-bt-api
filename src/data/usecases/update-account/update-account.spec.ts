import { mockHashComparer, mockHasher } from '@/test/data/cryptography/mock-cryptography'
import { mockUpdateAccountRepository } from '@/test/data/db/mock-db-account'
import { mockAccount } from '@/test/domain/models/mock-account'
import { UpdateAccount } from './update-account'
import { AccountModel, HashComparer, Hasher, UpdateAccountRepository } from './update-account.protocols'

const userId = 'any_id'

type SutTypes = {
  sut: UpdateAccount
  hashStub: Hasher
  hashComparerStub: HashComparer
  updateAccountRepositoryStub: UpdateAccountRepository
}

const makeSut = (): SutTypes => {
  const hashStub = mockHasher()
  const hashComparerStub = mockHashComparer()
  const updateAccountRepositoryStub = mockUpdateAccountRepository()
  const sut = new UpdateAccount(hashStub, hashComparerStub, updateAccountRepositoryStub)

  return {
    sut,
    hashStub,
    hashComparerStub,
    updateAccountRepositoryStub,
  }
}

describe('UpdateAccount Usecase', () => {
  it('should return error if the password is sent but the currentPassword is not sent', async () => {
    const { sut } = makeSut()
    const paramsToUpdate = { password: 'a' }
    const error = (await sut.update(userId, paramsToUpdate)) as Error

    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('É obrigatório envio da senha atual')
  })

  it('should return error if the currentPassword is incorrect', async () => {
    const { sut, hashComparerStub } = makeSut()
    const paramsToUpdate = { password: 'a', currentPassword: 'any_password' }
    jest.spyOn(hashComparerStub, 'isEqual').mockResolvedValueOnce(false)
    const error = (await sut.update(userId, paramsToUpdate)) as Error

    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('Senha atual incorreta')
  })

  it('should return error if the password length is lower than the minimum', async () => {
    const { sut } = makeSut()
    const paramsToUpdate = { password: 'a', currentPassword: '1234567AB' }
    const error = (await sut.update(userId, paramsToUpdate)) as Error

    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('A senha deve possuir no mínimo 8 caracteres')
  })

  it('should return error if the password doesn`t contain at least one letter', async () => {
    const { sut } = makeSut()
    const paramsToUpdate = { password: '12345678', currentPassword: '1234567AB' }
    const error = (await sut.update(userId, paramsToUpdate)) as Error

    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('A senha deve possuir ao menos uma letra')
  })

  it('should return error if the password doesn`t contain at least one number', async () => {
    const { sut } = makeSut()
    const paramsToUpdate = { password: 'abcdefghijk', currentPassword: '1234567AB' }
    const error = (await sut.update(userId, paramsToUpdate)) as Error

    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('A senha deve possuir ao menos um número')
  })

  it('should throw if Hasher throws', async () => {
    const { sut, hashStub } = makeSut()
    jest.spyOn(hashStub, 'hash').mockRejectedValueOnce(new Error())
    const paramsToUpdate = { password: 'a', currentPassword: 'abcdefghijk1' }
    const promise = sut.update(userId, paramsToUpdate)

    await expect(promise).rejects.toThrow()
  })

  it('should update the name of the account', async () => {
    const { sut, updateAccountRepositoryStub } = makeSut()
    const hashedPassword = 'any_hashed_password'
    const expectedResult = mockAccount({ hashedPassword })
    const updateSpy = jest.spyOn(updateAccountRepositoryStub, 'update').mockResolvedValueOnce(expectedResult)
    const params = { name: 'New name' }
    const account = (await sut.update(userId, params)) as AccountModel

    expect(updateSpy).toHaveBeenCalledWith(userId, { name: params.name })
    expect(account).toEqual(expectedResult)
    expect(account.hashedPassword).toEqual(hashedPassword)
  })

  it('should update all the possible value of the account', async () => {
    const { sut, updateAccountRepositoryStub, hashStub } = makeSut()
    const hashedPassword = 'any_hashed_password'
    const expectedResult = mockAccount({ hashedPassword })
    const hashSpy = jest.spyOn(hashStub, 'hash').mockResolvedValueOnce(hashedPassword)
    const updateSpy = jest.spyOn(updateAccountRepositoryStub, 'update').mockResolvedValueOnce(expectedResult)
    const params = { name: 'New name', currentPassword: 'abcdefghijk1', password: 'rajsiad21i' }
    const account = (await sut.update(userId, params)) as AccountModel

    expect(hashSpy).toHaveBeenCalledWith(params.password)
    expect(updateSpy).toHaveBeenCalledWith(userId, { hashedPassword, name: params.name })
    expect(account).toEqual(expectedResult)
    expect(account.hashedPassword).toEqual(hashedPassword)
  })
})
