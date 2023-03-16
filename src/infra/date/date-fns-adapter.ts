import { compareAsc } from 'date-fns'
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
    console.log(
      '🚀 ~ file: date-fns-adapter.ts:12 ~ DateFnsAdapter ~ isEndTimeGraterThanStartTime ~ startDateTime:',
      startDateTime
    )

    console.log(
      '🚀 ~ file: date-fns-adapter.ts:15 ~ DateFnsAdapter ~ isEndTimeGraterThanStartTime ~ endDateTime:',
      endDateTime
    )

    // compareAsc returns -1 if the first date is before the second date
    return compareAsc(startDateTime, endDateTime) === -1
  }

  hasConflicts: ({
    newTime,
    existingTimes
  }: TimeConflictCheckerModel) => boolean
}
