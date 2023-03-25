import { ServiceHour, FindServiceHours, FindServiceHoursModel, FindServiceHoursRepository } from './db-find-service-hours.protocols'

export class DbFindServiceHours implements FindServiceHours {
  constructor (
    private readonly findServiceHoursRepository: FindServiceHoursRepository
  ) {}

  async find (filters: FindServiceHoursModel): Promise<ServiceHour[]> {
    return await this.findServiceHoursRepository.findBy(filters)
  }
}
