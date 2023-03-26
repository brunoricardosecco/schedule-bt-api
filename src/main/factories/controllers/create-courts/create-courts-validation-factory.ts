import { ValidationComposite, RequiredFieldValidation } from '@/validation/validators'
import { Validation } from '@/presentation/protocols/validation'

export const createCourtsValidation = (): ValidationComposite => {
  const validations: Validation[] = []

  for (const field of ['courts']) {
    validations.push(new RequiredFieldValidation(field))
  }

  return new ValidationComposite(validations)
}
