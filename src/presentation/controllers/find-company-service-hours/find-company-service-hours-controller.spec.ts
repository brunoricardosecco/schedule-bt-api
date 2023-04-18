import { IFindServiceHours } from '@/domain/usecases/find-service-hours'
import { ServerError } from '@/presentation/errors'
import { mockAccount } from '@/test/domain/models/mock-account'
import { mockServiceHour } from '@/test/domain/models/mock-service-hour'
import { mockFindServiceHours } from '@/test/domain/usecases/mock-find-service-hours'
import { mockRequest } from '@/test/presentation/mock-http'
import { ok, serverError } from '../../helpers/http/httpHelper'
import { FindCompanyServiceHoursController } from './find-company-service-hours-controller'

const fakeRequest = mockRequest({ body: {}, query: { weekday: '0' }, user: mockAccount() })

type SutTypes = {
  sut: FindCompanyServiceHoursController
  findServiceHours: IFindServiceHours
}

const makeSut = (): SutTypes => {
  const findServiceHours = mockFindServiceHours()
  const sut = new FindCompanyServiceHoursController(findServiceHours)

  return {
    findServiceHours,
    sut,
  }
}

describe('FindCompanyServiceHours Controller', () => {
  it('should return 200 on success', async () => {
    const { sut, findServiceHours } = makeSut()
    const findSpy = jest.spyOn(findServiceHours, 'find')
    const httpResponse = await sut.handle(fakeRequest)

    expect(findSpy).toHaveBeenCalledWith({ companyId: 'any_company_id', weekday: 0 })
    expect(httpResponse).toEqual(ok({ serviceHours: [mockServiceHour()] }))
  })

  it('should return 500 if FindServiceHour throws', async () => {
    const { sut, findServiceHours } = makeSut()
    jest.spyOn(findServiceHours, 'find').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(serverError(new ServerError()))
  })
})
