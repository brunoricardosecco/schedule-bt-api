import { TimeConflictChecker } from '@/data/protocols/date/time-conflict-checker'
import { LoadServiceHoursByCompanyIdRepository } from '@/data/protocols/db/service-hour/load-service-hours-by-company-id'
import { AddCompanyServiceHourRepository, ServiceHour, AddCompanyServiceHour, AddCompanyServiceHourModel } from './db-add-company-service-hour.protocols'

export class DbAddCompanyServiceHour implements AddCompanyServiceHour {
  constructor (
    private readonly dbAddCompanyServiceHourRepository: AddCompanyServiceHourRepository,
    private readonly dbLoadServiceHoursByCompanyIdRepository: LoadServiceHoursByCompanyIdRepository,
    private readonly timeConflictChecker: TimeConflictChecker
  ) {}

  async add (serviceHourData: AddCompanyServiceHourModel): Promise<ServiceHour | Error> {
    const serviceHours = await this.dbLoadServiceHoursByCompanyIdRepository.load({
      companyId: serviceHourData.companyId,
      weekday: serviceHourData.weekday
    })

    const storedTimes = serviceHours.map(({ startTime, endTime }) => ({
      startTime,
      endTime
    }))

    const hasConflict = this.timeConflictChecker.hasConflicts({
      existingTimes: storedTimes,
      newTime: {
        startTime: serviceHourData.startTime,
        endTime: serviceHourData.endTime
      }
    })

    if (hasConflict) {
      return new Error('New service hour is conflicting with another')
    }

    return await this.dbAddCompanyServiceHourRepository.add(serviceHourData)
  }
}
