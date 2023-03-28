import { AddServiceHourRepository, ServiceHour, IAddServiceHour, AddServiceHourModel, LoadServiceHoursByCompanyIdAndWeekdayRepository, TimeConflictChecker } from './add-service-hour.protocols'

export class AddServiceHour implements IAddServiceHour {
  constructor (
    private readonly addServiceHourRepository: AddServiceHourRepository,
    private readonly dbLoadServiceHoursByCompanyIdAndWeekdayRepository: LoadServiceHoursByCompanyIdAndWeekdayRepository,
    private readonly timeConflictChecker: TimeConflictChecker
  ) {}

  async add (serviceHourData: AddServiceHourModel): Promise<ServiceHour | Error> {
    const { companyId, endTime, startTime, weekday } = serviceHourData

    const isValidTimes = this.timeConflictChecker.isEndTimeGreaterThanStartTime({
      startTime,
      endTime
    })

    if (!isValidTimes) {
      return new Error('O tempo de início precisa ser menor que o tempo de término')
    }

    const serviceHours = await this.dbLoadServiceHoursByCompanyIdAndWeekdayRepository.loadByCompanyIdAndWeekday({
      companyId,
      weekday
    })

    const storedTimes = serviceHours.map(({ startTime: storedStartTime, endTime: storedEndTime }) => ({
      startTime: storedStartTime,
      endTime: storedEndTime
    }))

    const hasConflict = this.timeConflictChecker.hasConflicts({
      existingTimes: storedTimes,
      newTime: {
        startTime,
        endTime
      }
    })

    if (hasConflict) {
      return new Error('O intervalo de tempo não pode conflitar com outro intervalo de tempo já cadastrado')
    }

    return await this.addServiceHourRepository.add(serviceHourData)
  }
}
