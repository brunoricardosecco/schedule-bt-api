import { ServiceHour, IFindServiceHours, FindServiceHoursModel, FindServiceHoursRepository } from './find-service-hours.protocols'

export class FindServiceHours implements IFindServiceHours {
  constructor (
    private readonly findServiceHoursRepository: FindServiceHoursRepository
  ) {}

  async find (filters: FindServiceHoursModel): Promise<ServiceHour[]> {
    return await this.findServiceHoursRepository.findBy(filters)
  }
}
