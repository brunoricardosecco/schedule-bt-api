import { ServiceHour, FindServiceHoursRepository, FindServiceHoursRepositoryParams } from './db-find-service-hours.protocols'
import { DbFindServiceHours } from './db-find-service-hours'

const makeFakeServiceHour = (): ServiceHour => ({
  id: 'valid_id',
  companyId: 'company_id',
  startTime: '09:00',
  endTime: '12:00',
  weekday: 0
})

const fakeServiceHour = makeFakeServiceHour()

const makeFindServiceHoursRepository = (): FindServiceHoursRepository => {
  class FindServiceHoursRepositoryStub implements FindServiceHoursRepository {
    async findBy (params: FindServiceHoursRepositoryParams): Promise<ServiceHour[]> {
      return await new Promise(resolve => { resolve([fakeServiceHour]) })
    }
  }

  return new FindServiceHoursRepositoryStub()
}

type SutTypes = {
  sut: DbFindServiceHours
  findServiceHoursRepository: FindServiceHoursRepository
}

const makeSut = (): SutTypes => {
  const findServiceHoursRepositoryStub = makeFindServiceHoursRepository()
  const sut = new DbFindServiceHours(findServiceHoursRepositoryStub)

  return {
    sut,
    findServiceHoursRepository: findServiceHoursRepositoryStub
  }
}

describe('DbFindServiceHours', () => {
  it('should returns service hours on success', async () => {
    const { sut, findServiceHoursRepository } = makeSut()

    const findBySpy = jest.spyOn(findServiceHoursRepository, 'findBy')

    const params = {
      companyId: 'any_id',
      weekday: 0
    }

    const serviceHours = await sut.find(params)

    expect(findBySpy).toHaveBeenCalledWith(params)
    expect(serviceHours.length).toBeGreaterThan(0)
    expect(serviceHours[0]).toEqual(fakeServiceHour)
  })
})
