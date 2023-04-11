import { Validation } from '@/presentation/protocols/validation'
import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators'
import { makeAddCompanyValidation } from './add-company-validation-factory'

jest.mock('@/validation/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    makeAddCompanyValidation()
    const validations: Validation[] = []

    for (const field of ['name', 'reservationPrice', 'reservationTimeInMinutes']) {
      validations.push(new RequiredFieldValidation(field))
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
