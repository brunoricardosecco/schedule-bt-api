import { IFindServiceHours } from '@/domain/usecases/find-service-hours'
import { ServerError } from '@/presentation/errors'
import { mockServiceHour } from '@/test/domain/models/mock-service-hour'
import { mockFindServiceHours } from '@/test/domain/usecases/mock-find-service-hours'
import { mockRequest } from '@/test/presentation/mock-http'
import { ok, serverError } from '../../helpers/http/httpHelper'
import { FindServiceHoursController } from './find-service-hours-controller'

const fakeRequest = mockRequest({ body: {}, query: { companyId: 'any_id', weekday: '0' } })

type SutTypes = {
  sut: FindServiceHoursController
  findServiceHours: IFindServiceHours
}

const makeSut = (): SutTypes => {
  const findServiceHours = mockFindServiceHours()
  const sut = new FindServiceHoursController(findServiceHours)

  return {
    findServiceHours,
    sut,
  }
}

describe('FindServiceHours Controller', () => {
  it('should return 200 on success', async () => {
    const { sut, findServiceHours } = makeSut()
    const findSpy = jest.spyOn(findServiceHours, 'find')
    const httpResponse = await sut.handle(fakeRequest)

    expect(findSpy).toHaveBeenCalledWith({ companyId: 'any_id', weekday: 0 })
    expect(httpResponse).toEqual(ok({ serviceHours: [mockServiceHour()] }))
  })
  it('should return 500 if FindServiceHour throws', async () => {
    const { sut, findServiceHours } = makeSut()
    jest.spyOn(findServiceHours, 'find').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(serverError(new ServerError()))
  })
})
