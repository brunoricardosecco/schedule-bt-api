import { Validation } from '@/presentation/protocols/validation'
import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators'

export const findCompanyReservationSlotsValidation = (): ValidationComposite => {
  const validations: Validation[] = []

  for (const field of ['date']) {
    validations.push(new RequiredFieldValidation(field))
  }

  return new ValidationComposite(validations)
}
