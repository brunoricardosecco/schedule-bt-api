import { MissingParamError, ServerError } from '@/presentation/errors'
import { badRequest, ok, serverError } from '@/presentation/helpers/http/httpHelper'
import { Validation } from '@/presentation/protocols'
import { mockAccount } from '@/test/domain/models/mock-account'
import { mockServiceHour, mockServiceHourData } from '@/test/domain/models/mock-service-hour'
import { mockAddServiceHour } from '@/test/domain/usecases/mock-add-service-hour'
import { mockRequest } from '@/test/presentation/mock-http'
import { mockValidation } from '@/test/validation/mock-validation'
import { AddServiceHourController } from './add-service-hour-controller'
import { IAddServiceHour } from './add-service-hour-controller.protocols'

type SutTypes = {
  validationStub: Validation
  addServiceHourStub: IAddServiceHour
  sut: AddServiceHourController
}

const makeSut = (): SutTypes => {
  const addServiceHourStub = mockAddServiceHour()
  const validationStub = mockValidation()

  const sut = new AddServiceHourController(addServiceHourStub, validationStub)

  return {
    validationStub,
    addServiceHourStub,
    sut,
  }
}

describe('AddServiceHour Controller', () => {
  it('should call AddServiceHour with correct values', async () => {
    const { addServiceHourStub, sut } = makeSut()
    const addSpy = jest.spyOn(addServiceHourStub, 'add')
    await sut.handle(mockRequest({ body: mockServiceHour(), user: mockAccount({ companyId: 'any_company_id' }) }))

    expect(addSpy).toHaveBeenCalledWith(mockServiceHourData())
  })

  it('should return 500 if AddServiceHour throws', async () => {
    const { sut, addServiceHourStub } = makeSut()
    jest.spyOn(addServiceHourStub, 'add').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  it('should return 200 if a valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(ok({ serviceHour: mockServiceHour() }))
  })

  it('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = mockRequest()
    await sut.handle(mockRequest())

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  it('should return 400 if AddServiceHour returns an Error', async () => {
    const { sut, addServiceHourStub } = makeSut()
    jest.spyOn(addServiceHourStub, 'add').mockResolvedValueOnce(new Error('any_error'))
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(badRequest(new Error('any_error')))
  })
})
