import { InvalidParamError } from '@/presentation/errors'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldToCompare')
}

describe('RequireField Validation', () => {
  it('should return a InvalidParamError if validation fails', () => {
    const sut = makeSut()

    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'different_value',
    })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  it('should return null if validation succeeds', () => {
    const sut = makeSut()

    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'any_value',
    })
    expect(error).toBeFalsy()
  })
})
