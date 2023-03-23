import { TimeConflictChecker } from '@/data/protocols/date/time-conflict-checker'
import { LoadServiceHoursByCompanyIdRepository } from '@/data/protocols/db/service-hour/load-service-hours-by-company-id'
import { AddServiceHourRepository, ServiceHour, AddServiceHour, AddServiceHourModel } from './db-add-service-hour.protocols'

export class DbAddServiceHour implements AddServiceHour {
  constructor (
    private readonly dbAddServiceHourRepository: AddServiceHourRepository,
    private readonly dbLoadServiceHoursByCompanyIdRepository: LoadServiceHoursByCompanyIdRepository,
    private readonly timeConflictChecker: TimeConflictChecker
  ) {}

  async add (serviceHourData: AddServiceHourModel): Promise<ServiceHour | Error> {
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

    return await this.dbAddServiceHourRepository.add(serviceHourData)
  }
}
