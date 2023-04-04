import { Validation } from '@/presentation/protocols/validation'
import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators'

export const makeUpdateCourtByIdValidation = (): ValidationComposite => {
  const validations: Validation[] = []

  for (const field of ['name']) {
    validations.push(new RequiredFieldValidation(field))
  }

  return new ValidationComposite(validations)
}
