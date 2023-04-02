import { ValidationComposite, RequiredFieldValidation } from '@/validation/validators'
import { Validation } from '@/presentation/protocols/validation'
import { updateAccountPasswordValidation } from './update-account-password-validation-factory'

jest.mock('@/validation/validators/validation-composite')

describe('CreateCourtsValidation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    updateAccountPasswordValidation()
    const validations: Validation[] = []

    for (const field of ['password']) {
      validations.push(new RequiredFieldValidation(field))
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
