import { Controller, HttpRequest, HttpResponse, EmailValidator, AddAccount, Validation } from './signup.protocols'
import { InvalidParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/httpHelper'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor (emailValidator: EmailValidator, addAccount: AddAccount, validation: Validation) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const { email, password, passwordConfirmation, name } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('PasswordConfirmation'))
      }

      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = await this.addAccount.add({ email, name, password })

      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
