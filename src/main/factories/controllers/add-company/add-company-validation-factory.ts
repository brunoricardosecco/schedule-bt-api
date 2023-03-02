import { ValidationComposite, RequiredFieldValidation } from '@/validation/validators'
import { Validation } from '@/presentation/protocols/validation'

export const makeAddCompanyValidation = (): ValidationComposite => {
  const validations: Validation[] = []

  for (const field of ['name', 'reservationPrice', 'reservationTimeInMinutes']) {
    validations.push(new RequiredFieldValidation(field))
  }

  return new ValidationComposite(validations)
}
