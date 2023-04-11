import { ValidationComposite, RequiredFieldValidation } from '@/validation/validators'
import { Validation } from '@/presentation/protocols/validation'
import { findCompanyReservationSlotsValidation } from './find-company-reservation-slots-validation'

jest.mock('@/validation/validators/validation-composite')

describe('CompanyReservationSlotsValidation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    findCompanyReservationSlotsValidation()
    const validations: Validation[] = []

    for (const field of ['date']) {
      validations.push(new RequiredFieldValidation(field))
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
