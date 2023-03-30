import { IUpdateAccountPassword, UpdateAccountRepository, Hasher, UpdateAccountPasswordReturn } from './update-account-password.protocols'

const MIN_PASSWORD_LENGTH = 8
const HAS_AT_LEAST_ONE_LETTER_REGEX = /[a-zA-Z]/
const HAS_AT_LEAST_ONE_NUMBER_REGEX = /[0-9]/

export class UpdateAccountPassword implements IUpdateAccountPassword {
  constructor (
    private readonly hasher: Hasher,
    private readonly accountRepository: UpdateAccountRepository
  ) {}

  async update (password: string): UpdateAccountPasswordReturn {
    if (password.length < MIN_PASSWORD_LENGTH) {
      return new Error('A senha deve possuir no mínimo 8 caracteres')
    }

    if (!HAS_AT_LEAST_ONE_LETTER_REGEX.test(password)) {
      return new Error('A senha deve possuir ao menos uma letra')
    }

    if (!HAS_AT_LEAST_ONE_NUMBER_REGEX.test(password)) {
      return new Error('A senha deve possuir ao menos um número')
    }

    const hashedPassword = await this.hasher.hash(password)

    const account = await this.accountRepository.update({
      hashedPassword
    })

    return account
  }
}
