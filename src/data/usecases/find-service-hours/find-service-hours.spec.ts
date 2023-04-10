import { FindServiceHours } from './find-service-hours'
import {
  FindServiceHoursRepository,
  FindServiceHoursRepositoryParams,
  IFindServiceHours,
  ServiceHour,
} from './find-service-hours.protocols'

const makeFakeServiceHour = (): ServiceHour => ({
  id: 'valid_id',
  companyId: 'company_id',
  startTime: '09:00',
  endTime: '12:00',
  weekday: 0,
})

const fakeServiceHour = makeFakeServiceHour()

const makeFindServiceHoursRepository = (): FindServiceHoursRepository => {
  class FindServiceHoursRepositoryStub implements FindServiceHoursRepository {
    async findBy(params: FindServiceHoursRepositoryParams): Promise<ServiceHour[]> {
      return await new Promise(resolve => {
        resolve([fakeServiceHour])
      })
    }
  }

  return new FindServiceHoursRepositoryStub()
}

type SutTypes = {
  sut: IFindServiceHours
  findServiceHoursRepository: FindServiceHoursRepository
}

const makeSut = (): SutTypes => {
  const findServiceHoursRepositoryStub = makeFindServiceHoursRepository()
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

    const params = {
      companyId: 'any_id',
      weekday: 0,
    }

    const serviceHours = await sut.find(params)

    expect(findBySpy).toHaveBeenCalledWith(params)
    expect(serviceHours.length).toBeGreaterThan(0)
    expect(serviceHours[0]).toEqual(fakeServiceHour)
  })
})
