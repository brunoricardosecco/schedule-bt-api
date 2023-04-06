import { ValidationComposite, RequiredFieldValidation } from '@/validation/validators'
import { Validation } from '@/presentation/protocols/validation'
import { createReservationIntervalsValidation } from './find-reservation-intervals-validation'

jest.mock('@/validation/validators/validation-composite')

describe('ReservationIntervalsValidation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    createReservationIntervalsValidation()
    const validations: Validation[] = []

    for (const field of ['date']) {
      validations.push(new RequiredFieldValidation(field))
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
