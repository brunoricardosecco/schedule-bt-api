import { ServiceHour } from '@/domain/models/service-hour'
import { AddServiceHourModel, IAddServiceHour } from '@/domain/usecases/add-service-hour'
import { mockServiceHour } from '../models/mock-service-hour'

export const mockAddServiceHour = (): IAddServiceHour => {
  class AddServiceHourStub implements IAddServiceHour {
    async add(serviceHour: AddServiceHourModel): Promise<ServiceHour | Error> {
      return await Promise.resolve(mockServiceHour())
    }
  }

  return new AddServiceHourStub()
}
