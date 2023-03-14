import {
  Decrypter,
  IAuthenticate,
  IAuthenticateReturn
} from './authenticate.protocols'

export class Authenticate implements IAuthenticate {
  constructor (
    private readonly decrypter: Decrypter
  ) {}

  async auth (token: string): Promise<IAuthenticateReturn | Error> {
    const tokenPayload = await this.decrypter.decrypt(token)

    if (!tokenPayload) {
      return new Error('Invalid token')
    }

    return tokenPayload
  }
}
