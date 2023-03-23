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
    const { companyId, endTime, startTime, weekday } = serviceHourData

    const serviceHours = await this.dbLoadServiceHoursByCompanyIdRepository.load({
      companyId,
      weekday
    })

    const storedTimes = serviceHours.map(({ startTime: storedStartTime, endTime: storedEndTime }) => ({
      startTime: storedStartTime,
      endTime: storedEndTime
    }))

    const isValidTimes = this.timeConflictChecker.isEndTimeGraterThanStartTime({
      startTime,
      endTime
    })

    const hasConflict = this.timeConflictChecker.hasConflicts({
      existingTimes: storedTimes,
      newTime: {
        startTime,
        endTime
      }
    })

    if (!isValidTimes) {
      return new Error('Start time must be lower than end time')
    }

    if (hasConflict) {
      return new Error('New service hour is conflicting with another')
    }

    return await this.dbAddCompanyServiceHourRepository.add(serviceHourData)
  }
}
