import jwt from 'jsonwebtoken'
import { JWTAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  ...jest.requireActual('jsonwebtoken'),
  async sign (): Promise<string> {
    return await new Promise(resolve => { resolve('any_token') })
  }
}))

describe('JWT Adapter', () => {
  it('should call sign with correct value', async () => {
    const sut = new JWTAdapter('secret')

    const signSpy = jest.spyOn(jwt, 'sign')

    await sut.encrypt('any_id')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
  })

  it('should return a token on sign success', async () => {
    const sut = new JWTAdapter('secret')

    const accessToken = await sut.encrypt('any_id')
    expect(accessToken).toBe('any_token')
  })
})
