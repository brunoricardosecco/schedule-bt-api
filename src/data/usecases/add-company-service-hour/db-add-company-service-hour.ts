import { AddCompanyServiceHourRepository } from '@/data/protocols/db/service-hour/add-company-service-hour'
import { ServiceHour } from '@/domain/models/serviceHour'
import { AddCompanyServiceHour, AddCompanyServiceHourModel } from '@/domain/usecases/add-company-service-hour'

export class DbAddCompanyServiceHour implements AddCompanyServiceHour {
  constructor (
    private readonly dbAddCompanyServiceHourRepository: AddCompanyServiceHourRepository
  ) {}

  async add (serviceHourData: AddCompanyServiceHourModel): Promise<ServiceHour> {
    return await this.dbAddCompanyServiceHourRepository.add(serviceHourData)
  }
}
