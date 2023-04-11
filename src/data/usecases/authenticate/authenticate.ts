import { Decrypter, IAuthenticate, IAuthenticateReturn, LoadAccountByIdRepository } from './authenticate.protocols'

export class Authenticate implements IAuthenticate {
  constructor(private readonly decrypter: Decrypter, private readonly accountRepository: LoadAccountByIdRepository) {}

  async auth(token: string): Promise<IAuthenticateReturn | Error> {
    const tokenPayload = await this.decrypter.decrypt(token)

    if (!tokenPayload) {
      return new Error('Token inválido')
    }

    const user = await this.accountRepository.loadById(tokenPayload.userId)

    if (!user) {
      return new Error('Usuário não encontrado')
    }

    return {
      user,
    }
  }
}
