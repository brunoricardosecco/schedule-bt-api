import { Authenticate } from './authenticate'
import {
  Decrypter,
  TokenPayload
} from './authenticate.protocols'

const defaultPayload = { userId: 'any_id' }

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (): Promise<TokenPayload | null> {
      return await new Promise(resolve => { resolve(defaultPayload) })
    }
  }

  return new DecrypterStub()
}

type SutTypes = {
  sut: Authenticate
  DecrypterStub: Decrypter
}

const makeSut = (): SutTypes => {
  const DecrypterStub = makeDecrypter()
  const sut = new Authenticate(DecrypterStub)

  return {
    sut,
    DecrypterStub
  }
}

describe('Authenticate Usecase', () => {
  it('should authenticate the user', async () => {
    const { sut, DecrypterStub } = makeSut()
    const token = 'token'

    const decryptSpy = jest.spyOn(DecrypterStub, 'decrypt')

    const response = await sut.auth(token)

    expect(decryptSpy).toHaveBeenCalledWith(token)
    expect(response).toStrictEqual(defaultPayload)
  })

  it('should return error if Decrypter returns null', async () => {
    const { sut, DecrypterStub } = makeSut()

    jest.spyOn(DecrypterStub, 'decrypt').mockReturnValueOnce(new Promise((resolve) => { resolve(null) }))

    const error = await sut.auth('token') as Error

    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('Invalid token')
  })
})
