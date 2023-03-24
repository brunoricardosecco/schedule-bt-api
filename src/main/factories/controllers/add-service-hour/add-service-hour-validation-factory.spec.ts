import { Validation } from '@/presentation/protocols'
import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators'
import { makeAddServiceHourValidation } from './add-service-hour-validation-factory'

jest.mock('@/validation/validators/validation-composite')

describe('AddServiceHourValidation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    makeAddServiceHourValidation()
    const validations: Validation[] = []

    for (const field of ['weekday', 'startTime', 'endTime', 'companyId']) {
      validations.push(new RequiredFieldValidation(field))
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
