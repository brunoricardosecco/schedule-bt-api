import { ServiceHour } from '@/domain/models/service-hour'
import { IDeleteServiceHour } from '@/domain/usecases/delete-service-hour'
import { mockServiceHour } from '../models/mock-service-hour'

export const mockDeleteServiceHour = (): IDeleteServiceHour => {
  class DeleteServiceHourStub implements IDeleteServiceHour {
    async delete({
      serviceHourId,
      companyId,
    }: {
      serviceHourId: string
      companyId: string
    }): Promise<ServiceHour | Error> {
      return await Promise.resolve(mockServiceHour())
    }
  }

  return new DeleteServiceHourStub()
}
