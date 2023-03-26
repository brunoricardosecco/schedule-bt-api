import { ServiceHour, IDeleteServiceHour, DeleteServiceHourRepository } from './delete-service-hour.protocols'

export class DeleteServiceHour implements IDeleteServiceHour {
  constructor (
    private readonly deleteServiceHourRepository: DeleteServiceHourRepository
  ) {}

  async delete (serviceHourId: string): Promise<ServiceHour> {
    return await this.deleteServiceHourRepository.delete(serviceHourId)
  }
}
