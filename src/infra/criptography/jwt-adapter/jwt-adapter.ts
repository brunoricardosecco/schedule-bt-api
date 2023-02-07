/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import jwt from 'jsonwebtoken'

import { Encrypter } from '../../../data/protocols/cryptography/encrypter'

export class JWTAdapter implements Encrypter {
  private readonly secret: string

  constructor (secret: string) {
    this.secret = secret
  }

  async encrypt (value: string): Promise<string> {
    return jwt.sign({ id: value }, this.secret)
  }
}