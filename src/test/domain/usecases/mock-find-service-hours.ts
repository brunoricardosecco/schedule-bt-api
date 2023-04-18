import { ServiceHour } from '@/domain/models/service-hour'
import { FindServiceHoursModel, IFindServiceHours } from '@/domain/usecases/find-service-hours'
import { mockServiceHour } from '../models/mock-service-hour'

export const mockFindServiceHours = (): IFindServiceHours => {
  class FindServiceHoursStub implements IFindServiceHours {
    async find({ companyId, weekday }: FindServiceHoursModel): Promise<ServiceHour[]> {
      return await Promise.resolve([mockServiceHour()])
    }
  }

  return new FindServiceHoursStub()
}
