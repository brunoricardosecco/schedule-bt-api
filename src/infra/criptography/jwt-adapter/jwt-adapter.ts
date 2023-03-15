import { Decrypter, TokenPayload } from '@/data/protocols/cryptography/decrypter'
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import jwt, { JwtPayload } from 'jsonwebtoken'

import { Encrypter } from '@/data/protocols/cryptography/encrypter'

export class JWTAdapter implements Encrypter, Decrypter {
  constructor (
    private readonly secret: string
  ) {}

  async encrypt (value: string): Promise<string> {
    return jwt.sign({ userId: value }, this.secret)
  }

  async decrypt (token: string): Promise<TokenPayload | null> {
    try {
      const payload = (await jwt.verify(token, this.secret)) as JwtPayload

      return {
        userId: payload.userId
      }
    } catch (error) {
      return null
    }
  }
}
