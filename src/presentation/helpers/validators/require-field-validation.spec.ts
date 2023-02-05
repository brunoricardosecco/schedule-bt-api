import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

describe('RequireField Validation', () => {
  it('should return a MissingParamError if validation fails', () => {
    const sut = new RequiredFieldValidation('field')

    const error = sut.validate({ name: 'any_name' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  it('should return null if validation succeeds', () => {
    const sut = new RequiredFieldValidation('field')

    const error = sut.validate({ field: 'any_name' })
    expect(error).toBeFalsy()
  })
})
