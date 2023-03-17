import {
  ServiceHourTimeModel,
  TimeConflictChecker,
  TimeConflictCheckerModel
} from '@/data/protocols/date/time-conflict-checker'
import { areIntervalsOverlapping as areIntervalsOverlappingFunc } from 'date-fns'

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

  hasConflicts ({
    newTime,
    existingTimes
  }: TimeConflictCheckerModel): boolean {
    let areIntervalsOverlapping = false

    const formattedExistingTimes = existingTimes.map(interval => {
      const intervalStartTime = new Date()
      const intervalEndTime = new Date()

      const startTimes = interval.startTime.split(':').map(value => Number(value))
      const endTimes = interval.endTime.split(':').map(value => Number(value))

      intervalStartTime.setHours(startTimes[0], startTimes[1], 0, 0)
      intervalEndTime.setHours(endTimes[0], endTimes[1], 0, 0)

      return {
        start: intervalStartTime,
        end: intervalEndTime
      }
    })

    const intervalNewStartTime = new Date()
    const intervalNewEndTime = new Date()

    const startTimes = newTime.startTime.split(':').map(value => Number(value))
    const endTimes = newTime.endTime.split(':').map(value => Number(value))

    intervalNewStartTime.setHours(startTimes[0], startTimes[1], 0, 0)
    intervalNewEndTime.setHours(endTimes[0], endTimes[1], 0, 0)

    const formattedNewInterval = {
      start: intervalNewStartTime,
      end: intervalNewEndTime
    }

    formattedExistingTimes.forEach((storedInterval) => {
      if (areIntervalsOverlappingFunc(formattedNewInterval, storedInterval, { inclusive: true })) {
        areIntervalsOverlapping = true
      }
    })

    return areIntervalsOverlapping
  }
}
