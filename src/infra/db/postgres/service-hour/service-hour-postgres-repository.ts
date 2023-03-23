import { AddServiceHourRepository, AddServiceHourRepositoryModel, ServiceHour } from '@/data/usecases/add-company-service-hour/db-add-service-hour.protocols'

export class ServiceHourPostgresRepository implements AddServiceHourRepository {
  async add (serviceHourData: AddServiceHourRepositoryModel): Promise<ServiceHour> {
    return await new Promise(resolve => {
      resolve({
        weekday: 0,
        startTime: '09:00',
        endTime: '20:00',
        companyId: 'ss',
        id: 'aa'
      })
    })
  }
}
