import { DeleteServiceHourRepository } from '@/data/protocols/db/service-hour/delete-service-hour'
import { IDeleteServiceHour } from '@/domain/usecases/delete-service-hour'
import { ServiceHour } from '../add-service-hour/db-add-service-hour.protocols'

export class DeleteServiceHour implements IDeleteServiceHour {
  constructor (
    private readonly deleteServiceHourRepository: DeleteServiceHourRepository
  ) {}

  async delete (serviceHourId: string): Promise<ServiceHour> {
    return await this.deleteServiceHourRepository.delete(serviceHourId)
  }
}
