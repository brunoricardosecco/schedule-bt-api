import { Validation } from '@/presentation/protocols/validation'
import { mockEmailValidator } from '@/test/validation/mock-email'
import {
  CompareFieldsValidation,
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '@/validation/validators'
import { makeSignUpValidation } from './signup-validation-factory'

jest.mock('@/validation/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation', 'companyId', 'role']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', mockEmailValidator()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
