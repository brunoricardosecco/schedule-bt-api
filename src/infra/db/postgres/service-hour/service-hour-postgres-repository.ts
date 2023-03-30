import { FindServiceHoursRepository, FindServiceHoursRepositoryParams } from '@/data/protocols/db/service-hour/find-service-hours'
import { LoadServiceHoursByCompanyIdAndWeekdayRepository, LoadServiceHoursByCompanyIdRepositoryModel } from '@/data/protocols/db/service-hour/load-service-hours-by-company-id-and-weekday'
import { AddServiceHourRepository, AddServiceHourRepositoryModel, ServiceHour } from '@/data/usecases/add-service-hour/add-service-hour.protocols'
import { db } from '@/infra/db/orm/prisma'

export class ServiceHourPostgresRepository implements AddServiceHourRepository, LoadServiceHoursByCompanyIdAndWeekdayRepository, FindServiceHoursRepository {
  async add (serviceHourData: AddServiceHourRepositoryModel): Promise<ServiceHour> {
    return await db.serviceHours.create({
      data: serviceHourData
    })
  }

  async loadByCompanyIdAndWeekday ({ companyId, weekday }: LoadServiceHoursByCompanyIdRepositoryModel): Promise<ServiceHour[]> {
    return await db.serviceHours.findMany({
      where: {
        companyId,
        weekday
      }
    })
  }

  async findBy (params: FindServiceHoursRepositoryParams): Promise<ServiceHour[]> {
    return await db.serviceHours.findMany({
      where: params
    })
  }
}
