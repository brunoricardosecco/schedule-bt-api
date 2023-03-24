import { ServiceHour } from '@/domain/models/serviceHour'
import { AddServiceHour, AddServiceHourModel } from '@/domain/usecases/add-service-hour'
import { MissingParamError, ServerError } from '@/presentation/errors'
import { badRequest, ok, serverError } from '@/presentation/helpers/http/httpHelper'
import { HttpRequest, Validation } from '@/presentation/protocols'
import { AddServiceHourController } from './add-service-hour-controller'

const makeFakeServiceHour = (): ServiceHour => ({
  companyId: 'any_company_id',
  endTime: 'any_start_time',
  startTime: 'any_end_time',
  weekday: 0,
  id: 'any_id'
})

const makeAddServiceHour = (): AddServiceHour => {
  class AddServiceHourStub implements AddServiceHour {
    async add (serviceHour: AddServiceHourModel): Promise<ServiceHour | Error> {
      return await new Promise(resolve => { resolve(makeFakeServiceHour()) })
    }
  }

  return new AddServiceHourStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }

  return new ValidationStub()
}

const makeFakeServiceHourData = (): AddServiceHourModel => ({
  companyId: 'any_company_id',
  endTime: 'any_start_time',
  startTime: 'any_end_time',
  weekday: 0
})

const serviceHour = makeFakeServiceHour()
const addServiceHourData = makeFakeServiceHourData()

const makeFakeRequest = (): HttpRequest => {
  return {
    body: addServiceHourData
  }
}

type SutTypes = {
  validationStub: Validation
  addServiceHourStub: AddServiceHour
  sut: AddServiceHourController
}

const makeSut = (): SutTypes => {
  const addServiceHourStub = makeAddServiceHour()
  const validationStub = makeValidation()

  const sut = new AddServiceHourController(addServiceHourStub, validationStub)

  return {
    validationStub,
    addServiceHourStub,
    sut
  }
}

describe('AddServiceHour Controller', () => {
  it('should call AddServiceHour with correct values', async () => {
    const { addServiceHourStub, sut } = makeSut()

    const addSpy = jest.spyOn(addServiceHourStub, 'add')

    await sut.handle(makeFakeRequest())

    expect(addSpy).toHaveBeenCalledWith(addServiceHourData)
  })
  it('should return 500 if AddServiceHour throws', async () => {
    const { sut, addServiceHourStub } = makeSut()
    jest.spyOn(addServiceHourStub, 'add').mockImplementationOnce(async () => { return await new Promise((resolve, reject) => { reject(new Error()) }) })

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })
  it('should return 200 if a valid data is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(ok({
      serviceHour
    }))
  })
  it('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()

    const validateSpy = jest.spyOn(validationStub, 'validate')

    const httpRequest = makeFakeRequest()

    await sut.handle(makeFakeRequest())

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
  it('should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
