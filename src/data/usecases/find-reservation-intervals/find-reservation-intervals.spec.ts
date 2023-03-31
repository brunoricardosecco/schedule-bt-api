import { IFindReservationIntervals } from '@/domain/usecases/find-reservation-intervals'
import { FindServiceHoursRepository, FindServiceHoursRepositoryParams, ServiceHour } from '../find-service-hours/find-service-hours.protocols'
import { FindReservationIntervals } from './find-reservation-intervals'

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
  sut: IFindReservationIntervals
  findServiceHoursRepository: FindServiceHoursRepository
}

const makeSut = (): SutTypes => {
  const findServiceHoursRepositoryStub = makeFindServiceHoursRepository()
  const sut = new FindReservationIntervals(findServiceHoursRepositoryStub)

  return {
    sut,
    findServiceHoursRepository: findServiceHoursRepositoryStub
  }
}

describe('FindReservationIntervals', () => {
  it('should calls FindServiceHoursRepository with correct values', async () => {
    const { findServiceHoursRepository, sut } = makeSut()
    const findBySpy = jest.spyOn(findServiceHoursRepository, 'findBy')

    await sut.find(new Date(), 'any_company_id')

    expect(findBySpy).toHaveBeenCalledWith({ companyId: 'any_company_id', weekday: new Date().getDay() })
  })
})
