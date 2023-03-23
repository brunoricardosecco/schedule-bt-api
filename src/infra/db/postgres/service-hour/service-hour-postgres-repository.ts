import { AddServiceHourRepository, AddServiceHourRepositoryModel, ServiceHour } from '@/data/usecases/add-company-service-hour/db-add-service-hour.protocols'
import { db } from '@/infra/db/orm/prisma'

export class ServiceHourPostgresRepository implements AddServiceHourRepository {
  async add (serviceHourData: AddServiceHourRepositoryModel): Promise<ServiceHour> {
    return await db.serviceHours.create({
      data: serviceHourData
    })
  }
}
