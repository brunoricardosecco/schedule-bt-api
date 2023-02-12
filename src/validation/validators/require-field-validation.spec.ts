import { MissingParamError } from '@/presentation/errors'
import { RequiredFieldValidation } from './required-field-validation'

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('field')
}

describe('RequireField Validation', () => {
  it('should return a MissingParamError if validation fails', () => {
    const sut = makeSut()

    const error = sut.validate({ name: 'any_name' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  it('should return null if validation succeeds', () => {
    const sut = makeSut()

    const error = sut.validate({ field: 'any_name' })
    expect(error).toBeFalsy()
  })
})
