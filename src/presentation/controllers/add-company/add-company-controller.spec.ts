import { MissingParamError, ServerError } from '@/presentation/errors'
import { badRequest, ok, serverError } from '@/presentation/helpers/http/httpHelper'
import { mockCompany, mockCompanyData } from '@/test/domain/models/mock-company'
import { mockAddCompany } from '@/test/domain/usecases/mock-add-company'
import { mockRequest } from '@/test/presentation/mock-http'
import { mockValidation } from '@/test/validation/mock-validation'
import { AddCompanyController } from './add-company-controller'
import { AddCompany, Validation } from './add-company-controller.protocols'

type SutTypes = {
  sut: AddCompanyController
  addCompanyStub: AddCompany
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const validationStub = mockValidation()
  const addCompanyStub = mockAddCompany()
  const sut = new AddCompanyController(addCompanyStub, validationStub)

  return {
    sut,
    addCompanyStub,
    validationStub,
  }
}

describe('AddCompany Controller', () => {
  it('should call AddCompany with correct values', async () => {
    const { sut, addCompanyStub } = makeSut()
    const addSpy = jest.spyOn(addCompanyStub, 'add')
    await sut.handle(mockRequest({ body: mockCompanyData() }))

    expect(addSpy).toHaveBeenCalledWith(mockCompanyData())
  })

  it('should return 500 if AddCompany throws', async () => {
    const { sut, addCompanyStub } = makeSut()
    jest.spyOn(addCompanyStub, 'add').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  it('should return 200 if a valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(ok({ company: mockCompany() }))
  })

  it('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
