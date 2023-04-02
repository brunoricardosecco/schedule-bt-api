import { IDeleteServiceHour } from '@/domain/usecases/delete-service-hour'
import { ServerError } from '@/presentation/errors'
import { okNoContent, serverError } from '@/presentation/helpers/http/httpHelper'
import { HttpRequest, ServiceHour } from '../add-service-hour/add-service-hour-controller.protocols'
import { DeleteCompanyServiceHourController } from './delete-company-service-hour-controller'

const makeFakeServiceHour = (): ServiceHour => ({
  companyId: 'any_company_id',
  endTime: 'any_start_time',
  startTime: 'any_end_time',
  weekday: 0,
  id: 'any_id'
})
const fakeServiceHour = makeFakeServiceHour()

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {},
    query: {},
    params: {
      serviceHourId: 'any_id'
    }
  }
}
const fakeRequest = makeFakeRequest()

const makeDeleteServiceHour = (): IDeleteServiceHour => {
  class DeleteServiceHourStub implements IDeleteServiceHour {
    async delete (serviceHourId: string): Promise<ServiceHour> {
      return await new Promise(resolve => { resolve(fakeServiceHour) })
    }
  }

  return new DeleteServiceHourStub()
}

type SutTypes = {
  sut: DeleteCompanyServiceHourController
  deleteServiceHour: IDeleteServiceHour
}

const makeSut = (): SutTypes => {
  const deleteServiceHour = makeDeleteServiceHour()
  const sut = new DeleteCompanyServiceHourController(deleteServiceHour)

  return {
    sut,
    deleteServiceHour
  }
}

describe('DeleteServiceHour Controller', () => {
  it('should return 204 on success', async () => {
    const { sut, deleteServiceHour } = makeSut()
    const deleteSpy = jest.spyOn(deleteServiceHour, 'delete')

    const httpResponse = await sut.handle(fakeRequest)

    expect(deleteSpy).toHaveBeenCalledWith('any_id')
    expect(httpResponse).toEqual(okNoContent())
  })
  it('should return serverError if DeleteServiceHour throws', async () => {
    const { sut, deleteServiceHour } = makeSut()
    jest.spyOn(deleteServiceHour, 'delete').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => { reject(new Error()) })
    })

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(serverError(new ServerError()))
  })
})
