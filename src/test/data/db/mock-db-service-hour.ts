import {
  AddServiceHourRepository,
  AddServiceHourRepositoryModel,
  LoadServiceHoursByCompanyIdAndWeekdayRepository,
  LoadServiceHoursByCompanyIdRepositoryModel,
  ServiceHour,
} from '@/data/usecases/add-service-hour/add-service-hour.protocols'
import { DeleteServiceHourRepository } from '@/data/usecases/delete-service-hour/delete-service-hour.protocols'
import {
  FindServiceHoursRepository,
  FindServiceHoursRepositoryParams,
} from '@/data/usecases/find-service-hours/find-service-hours.protocols'
import { mockServiceHour } from '@/test/domain/models/mock-service-hour'

export const mockAddServiceHourRepository = (): AddServiceHourRepository => {
  class AddServiceHourRepositoryStub implements AddServiceHourRepository {
    async add(serviceHourData: AddServiceHourRepositoryModel): Promise<ServiceHour> {
      return await Promise.resolve(mockServiceHour())
    }
  }

  return new AddServiceHourRepositoryStub()
}

export const mockLoadServiceHoursByCompanyIdAndWeekdayRepository =
  (): LoadServiceHoursByCompanyIdAndWeekdayRepository => {
    class LoadServiceHoursByCompanyIdAndWeekdayRepositoryStub
      implements LoadServiceHoursByCompanyIdAndWeekdayRepository
    {
      async loadByCompanyIdAndWeekday({
        companyId,
        weekday,
      }: LoadServiceHoursByCompanyIdRepositoryModel): Promise<ServiceHour[]> {
        return await Promise.resolve([mockServiceHour()])
      }
    }

    return new LoadServiceHoursByCompanyIdAndWeekdayRepositoryStub()
  }

export const mockDeleteServiceHourRepository = (): DeleteServiceHourRepository => {
  class DeleteServiceHourRepositoryStub implements DeleteServiceHourRepository {
    async delete(serviceHourId: string): Promise<ServiceHour> {
      return mockServiceHour()
    }
  }

  return new DeleteServiceHourRepositoryStub()
}

export const mockFindServiceHoursRepository = (): FindServiceHoursRepository => {
  class FindServiceHoursRepositoryStub implements FindServiceHoursRepository {
    async findBy(params: FindServiceHoursRepositoryParams): Promise<ServiceHour[]> {
      return await Promise.resolve([mockServiceHour()])
    }
  }

  return new FindServiceHoursRepositoryStub()
}
