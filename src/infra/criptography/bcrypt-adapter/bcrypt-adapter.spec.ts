import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return await Promise.resolve('hash')
  },
  async compare(): Promise<boolean> {
    return await Promise.resolve(true)
  },
}))

const salt = 12

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  it('should call hash with correct value', async () => {
    const sut = makeSut()

    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.hash('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  it('should return a valid hash on hash success', async () => {
    const sut = makeSut()

    const hash = await sut.hash('any_value')
    expect(hash).toBe('hash')
  })

  it('should throw if hash throws', async () => {
    const sut = makeSut()

    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.hash('any_value')
    await expect(promise).rejects.toThrow()
  })

  it('should call isEqual with correct value', async () => {
    const sut = makeSut()

    const hashSpy = jest.spyOn(bcrypt, 'compare')

    await sut.isEqual('any_value', 'hashed_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', 'hashed_value')
  })

  it('should return true when isEqual succeeds', async () => {
    const sut = makeSut()

    const isEqual = await sut.isEqual('any_value', 'hashed_value')
    expect(isEqual).toBe(true)
  })

  it('should return false when isEqual fails', async () => {
    const sut = makeSut()

    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => false)

    const isEqual = await sut.isEqual('any_value', 'hashed_value')
    expect(isEqual).toBe(false)
  })

  it('should throw if isEqual throws', async () => {
    const sut = makeSut()

    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.isEqual('any_value', 'hashed_value')
    await expect(promise).rejects.toThrow()
  })
})
