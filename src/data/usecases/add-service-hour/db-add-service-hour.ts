import { AddServiceHourRepository, ServiceHour, AddServiceHour, AddServiceHourModel, LoadServiceHoursByCompanyIdAndWeekdayRepository, TimeConflictChecker } from './db-add-service-hour.protocols'

export class DbAddServiceHour implements AddServiceHour {
  constructor (
    private readonly dbAddServiceHourRepository: AddServiceHourRepository,
    private readonly dbLoadServiceHoursByCompanyIdAndWeekdayRepository: LoadServiceHoursByCompanyIdAndWeekdayRepository,
    private readonly timeConflictChecker: TimeConflictChecker
  ) {}

  async add (serviceHourData: AddServiceHourModel): Promise<ServiceHour | Error> {
    const { companyId, endTime, startTime, weekday } = serviceHourData

    const serviceHours = await this.dbLoadServiceHoursByCompanyIdAndWeekdayRepository.loadByCompanyIdAndWeekday({
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

    if (!isValidTimes) {
      return new Error('Start time must be before end time')
    }

    const hasConflict = this.timeConflictChecker.hasConflicts({
      existingTimes: storedTimes,
      newTime: {
        startTime,
        endTime
      }
    })

    if (hasConflict) {
      return new Error('New service hour is conflicting with another')
    }

    return await this.dbAddServiceHourRepository.add(serviceHourData)
  }
}
