import {
  ServiceHourTimeModel,
  TimeConflictChecker,
  TimeConflictCheckerModel
} from '@/data/protocols/date/time-conflict-checker'

export class DateFnsAdapter implements TimeConflictChecker {
  isEndTimeGraterThanStartTime ({
    startTime,
    endTime
  }: ServiceHourTimeModel): boolean {
    const splittedStartTime = startTime
      .split(':')
      .map((piece) => Number(piece))
    const splittedEndTime = endTime.split(':').map((piece) => Number(piece))

    const startDateTime = new Date()
    startDateTime.setHours(splittedStartTime[0], splittedStartTime[1])
    const endDateTime = new Date()
    endDateTime.setHours(splittedEndTime[0], splittedEndTime[1])

    return endDateTime.getTime() > startDateTime.getTime()
  }

  hasConflicts: ({
    newTime,
    existingTimes
  }: TimeConflictCheckerModel) => boolean
}
