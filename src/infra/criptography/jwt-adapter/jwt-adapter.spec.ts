import { TokenPayload } from '@/data/protocols/cryptography/decrypter'
import jwt from 'jsonwebtoken'
import { JWTAdapter } from './jwt-adapter'

const defaultPayload = { userId: 'any_id' }

jest.mock('jsonwebtoken', () => ({
  ...jest.requireActual('jsonwebtoken'),
  async sign(): Promise<string> {
    return await new Promise(resolve => {
      resolve('any_token')
    })
  },
  async verify(): Promise<TokenPayload | null> {
    return await new Promise(resolve => {
      resolve(defaultPayload)
    })
  },
}))

const makeSut = (): JWTAdapter => {
  return new JWTAdapter('secret')
}

describe('JWT Adapter', () => {
  describe('encrypt', () => {
    it('should call sign with correct value', async () => {
      const sut = makeSut()

      const signSpy = jest.spyOn(jwt, 'sign')

      await sut.encrypt('any_id')
      expect(signSpy).toHaveBeenCalledWith({ userId: 'any_id' }, 'secret')
    })

    it('should return a token on sign success', async () => {
      const sut = makeSut()

      const accessToken = await sut.encrypt('any_id')
      expect(accessToken).toBe('any_token')
    })

    it('should throws if sign throws', async () => {
      const sut = makeSut()

      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error()
      })

      const promise = sut.encrypt('any_id')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('decrypt', () => {
    it('should successfully decrypt the token', async () => {
      const sut = makeSut()
      const token = 'token'
      const secret = 'secret'

      const verifySpy = jest.spyOn(jwt, 'verify')

      const payload = await sut.decrypt(token)

      expect(verifySpy).toHaveBeenCalledWith(token, secret)
      expect(payload).toStrictEqual(defaultPayload)
    })

    it('should return null if verify throws', async () => {
      const sut = makeSut()
      const token = 'token'

      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error()
      })

      const response = await sut.decrypt(token)

      expect(response).toBeNull()
    })
  })
})
