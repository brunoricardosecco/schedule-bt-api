import { Validation } from '@/presentation/protocols/validation'
import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators'
import { createCourtsValidation } from './create-courts-validation-factory'

jest.mock('@/validation/validators/validation-composite')

describe('CreateCourtsValidation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    createCourtsValidation()
    const validations: Validation[] = []

    for (const field of ['courts']) {
      validations.push(new RequiredFieldValidation(field))
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
