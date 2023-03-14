import {
  Decrypter,
  IAuthenticate
} from './authenticate.protocols'

export class Authenticate implements IAuthenticate {
  constructor (
    private readonly decrypter: Decrypter
  ) {}

  async auth (token: string): Promise<boolean> {
    const isTokenValid = await this.decrypter.decrypt(token)

    return isTokenValid
  }
}
