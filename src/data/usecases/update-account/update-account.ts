import {
  HashComparer,
  Hasher,
  IUpdateAccount,
  UpdateAccountParams,
  UpdateAccountRepository,
  UpdateAccountReturn,
} from './update-account.protocols'

const MIN_PASSWORD_LENGTH = 8
const HAS_AT_LEAST_ONE_LETTER_REGEX = /[a-zA-Z]/
const HAS_AT_LEAST_ONE_NUMBER_REGEX = /[0-9]/

export class UpdateAccount implements IUpdateAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly hashComparer: HashComparer,
    private readonly updateAccountRepository: UpdateAccountRepository
  ) {}

  async update(userId: string, params: UpdateAccountParams): UpdateAccountReturn {
    const { password, currentPassword, name } = params

    const paramsToUpdate: Record<string, any> = {
      name,
    }

    if (password) {
      if (!currentPassword) {
        return new Error('É obrigatório envio da senha atual')
      }

      const hashedCurrentPassword = await this.hasher.hash(currentPassword)
      const isCurrentPasswordCorrect = await this.hashComparer.isEqual(currentPassword, hashedCurrentPassword)

      if (!isCurrentPasswordCorrect) {
        return new Error('Senha atual incorreta')
      }

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

      paramsToUpdate.hashedPassword = hashedPassword
    }

    const account = await this.updateAccountRepository.update(userId, paramsToUpdate)

    return account
  }
}
