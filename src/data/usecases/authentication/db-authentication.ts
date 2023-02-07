import {
  AuthenticationModel,
  HashComparer,
  Encrypter,
  LoadAccountByEmailRepository,
  Authentication
} from './db-authentication.protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter
  ) {}

  async auth (authenticationModel: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authenticationModel.email)
    if (!account) {
      return null
    }

    const isEqual = await this.hashComparer.isEqual(authenticationModel.password, account.password)
    if (!isEqual) {
      return null
    }

    const accessToken = await this.encrypter.encrypt(account.id)
    return accessToken
  }
}
