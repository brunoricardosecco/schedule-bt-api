import { Validation } from '@/presentation/protocols/validation'
import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators'
import { makeUpdateCourtByIdValidation } from './update-court-by-id-validation-factory'

jest.mock('@/validation/validators/validation-composite')

describe('UpdateCourtByIdValidation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    makeUpdateCourtByIdValidation()
    const validations: Validation[] = []

    for (const field of ['name']) {
      validations.push(new RequiredFieldValidation(field))
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
