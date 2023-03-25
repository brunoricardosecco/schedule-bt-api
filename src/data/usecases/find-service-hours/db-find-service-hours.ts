import { FindServiceHoursRepository } from '@/data/protocols/db/service-hour/find-service-hours'
import { FindServiceHours, FindServiceHoursModel } from '@/domain/usecases/find-service-hours'
import { ServiceHour } from '../add-service-hour/db-add-service-hour.protocols'

export class DbFindServiceHours implements FindServiceHours {
  constructor (
    private readonly findServiceHoursRepository: FindServiceHoursRepository
  ) {}

  async find ({ companyId, weekday }: FindServiceHoursModel): Promise<ServiceHour[]> {
    return await this.findServiceHoursRepository.findBy({
      companyId,
      weekday
    })
  }
}
