import { ValidationComposite, RequiredFieldValidation } from '@/validation/validators'
import { Validation } from '@/presentation/protocols/validation'

export const findCompanyReservationIntervalsValidation = (): ValidationComposite => {
  const validations: Validation[] = []

  for (const field of ['date']) {
    validations.push(new RequiredFieldValidation(field))
  }

  return new ValidationComposite(validations)
}
