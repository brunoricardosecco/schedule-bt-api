import jwt from 'jsonwebtoken'
import { JWTAdapter } from './jwt-adapter'

describe('JWT Adapter', () => {
  it('should call sign with correct value', async () => {
    const sut = new JWTAdapter('secret')

    const signSpy = jest.spyOn(jwt, 'sign')

    await sut.encrypt('any_id')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
  })
})
