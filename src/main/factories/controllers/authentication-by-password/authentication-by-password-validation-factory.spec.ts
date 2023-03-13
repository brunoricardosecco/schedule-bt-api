import { RequiredFieldValidation, EmailValidation, ValidationComposite } from '@/validation/validators'
import { Validation } from '@/presentation/protocols/validation'
import { EmailValidator } from '@/validation/protocols/email-validator'
import { makeAuthenticationByPasswordValidation } from './authentication-by-password-validation-factory'

jest.mock('@/validation/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

describe('AuthenticationByPasswordValidationFactory', () => {
  it('should call ValidationComposite with all validations', () => {
    makeAuthenticationByPasswordValidation()
    const validations: Validation[] = []

    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', makeEmailValidator()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
