import {
  TAuthenticationByPasswordParams,
  HashComparer,
  Encrypter,
  LoadAccountByEmailRepository,
  IAuthenticationByPassword
} from './authentication-by-password.protocols'

export class AuthenticationByPassword implements IAuthenticationByPassword {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter
  ) {}

  async auth (params: TAuthenticationByPasswordParams): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(params.email)

    if (!account) {
      return null
    }

    const isEqual = await this.hashComparer.isEqual(params.password, account.hashedPassword as string)

    if (!isEqual) {
      return null
    }

    const accessToken = await this.encrypter.encrypt(account.id)

    return accessToken
  }
}
