import { ServiceHour } from '@/domain/models/serviceHour'
import { AddServiceHour, AddServiceHourModel } from '@/domain/usecases/add-service-hour'
import { ServerError } from '@/presentation/errors'
import { serverError } from '@/presentation/helpers/http/httpHelper'
import { HttpRequest } from '@/presentation/protocols'
import { AddServiceHourController } from './add-service-hour-controller'

const makeAddServiceHourModel = (): ServiceHour => ({
  companyId: 'any_company_id',
  endTime: 'any_start_time',
  startTime: 'any_end_time',
  weekday: 0,
  id: 'any_id'
})

const makeAddServiceHour = (): AddServiceHour => {
  class AddServiceHourStub implements AddServiceHour {
    async add (serviceHour: AddServiceHourModel): Promise<ServiceHour | Error> {
      return await new Promise(resolve => { resolve(makeAddServiceHourModel()) })
    }
  }

  return new AddServiceHourStub()
}

const makeFakeServiceHourData = (): AddServiceHourModel => ({
  companyId: 'any_company_id',
  endTime: 'any_start_time',
  startTime: 'any_end_time',
  weekday: 0
})

const addServiceHourData = makeFakeServiceHourData()

const makeFakeRequest = (): HttpRequest => {
  return {
    body: addServiceHourData
  }
}

type SutTypes = {
  addServiceHour: AddServiceHour
  sut: AddServiceHourController
}

const makeSut = (): SutTypes => {
  const addServiceHour = makeAddServiceHour()

  const sut = new AddServiceHourController(addServiceHour)

  return {
    addServiceHour,
    sut
  }
}

describe('AddServiceHour Controller', () => {
  it('should call AddServiceHour with correct values', async () => {
    const { addServiceHour, sut } = makeSut()

    const addSpy = jest.spyOn(addServiceHour, 'add')

    await sut.handle(makeFakeRequest())

    expect(addSpy).toHaveBeenCalledWith(addServiceHourData)
  })
  it('should return 500 if AddServiceHour throws', async () => {
    const { sut, addServiceHour } = makeSut()
    jest.spyOn(addServiceHour, 'add').mockImplementationOnce(async () => { return await new Promise((resolve, reject) => { reject(new Error()) }) })

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })
})
