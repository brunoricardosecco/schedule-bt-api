import { Validation } from '@/presentation/protocols/validation'
import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators'

export const createCourtsValidation = (): ValidationComposite => {
  const validations: Validation[] = []

  for (const field of ['courts']) {
    validations.push(new RequiredFieldValidation(field))
  }

  return new ValidationComposite(validations)
}
