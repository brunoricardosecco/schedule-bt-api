import { Validation } from '@/presentation/protocols'
import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators'

export const makeAddServiceHourValidation = (): ValidationComposite => {
  const validations: Validation[] = []

  for (const field of ['weekday', 'startTime', 'endTime']) {
    validations.push(new RequiredFieldValidation(field))
  }

  return new ValidationComposite(validations)
}
