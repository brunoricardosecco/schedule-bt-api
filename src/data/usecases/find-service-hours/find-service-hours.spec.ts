import { mockFindServiceHoursRepository } from '@/test/data/db/mock-db-service-hour'
import { mockServiceHour } from '@/test/domain/models/mock-service-hour'
import { FindServiceHours } from './find-service-hours'
import { FindServiceHoursRepository, IFindServiceHours } from './find-service-hours.protocols'

type SutTypes = {
  sut: IFindServiceHours
  findServiceHoursRepository: FindServiceHoursRepository
}

const makeSut = (): SutTypes => {
  const findServiceHoursRepositoryStub = mockFindServiceHoursRepository()
  const sut = new FindServiceHours(findServiceHoursRepositoryStub)

  return {
    sut,
    findServiceHoursRepository: findServiceHoursRepositoryStub,
  }
}

describe('FindServiceHours', () => {
  it('should returns service hours on success', async () => {
    const { sut, findServiceHoursRepository } = makeSut()
    const findBySpy = jest.spyOn(findServiceHoursRepository, 'findBy')
    const params = { companyId: 'any_id', weekday: 0 }
    const serviceHours = await sut.find(params)

    expect(findBySpy).toHaveBeenCalledWith(params)
    expect(serviceHours.length).toBeGreaterThan(0)
    expect(serviceHours[0]).toEqual(mockServiceHour())
  })
})
