import { ValidationComposite, RequiredFieldValidation } from '@/validation/validators'
import { Validation } from '@/presentation/protocols/validation'
import { findCompanyReservationIntervalsValidation } from './find-company-reservation-intervals-validation'

jest.mock('@/validation/validators/validation-composite')

describe('CompanyReservationIntervalsValidation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    findCompanyReservationIntervalsValidation()
    const validations: Validation[] = []

    for (const field of ['date']) {
      validations.push(new RequiredFieldValidation(field))
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
