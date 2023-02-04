import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/httpHelper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { EmailValidator } from '../signup/signup.protocols'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['email', 'password']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    const { email } = httpRequest.body

    this.emailValidator.isValid(email)

    return await new Promise(resolve => {
      resolve({
        statusCode: 400,
        body: new MissingParamError('email')
      })
    })
  }
}
