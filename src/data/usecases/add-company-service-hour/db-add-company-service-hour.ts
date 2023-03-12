import { AddCompanyServiceHourRepository, ServiceHour, AddCompanyServiceHour, AddCompanyServiceHourModel } from './db-add-company-service-hour.protocols'

export class DbAddCompanyServiceHour implements AddCompanyServiceHour {
  constructor (
    private readonly dbAddCompanyServiceHourRepository: AddCompanyServiceHourRepository
  ) {}

  async add (serviceHourData: AddCompanyServiceHourModel): Promise<ServiceHour> {
    return await this.dbAddCompanyServiceHourRepository.add(serviceHourData)
  }
}
