import {
  ServiceHourTimeModel,
  TimeConflictChecker,
  TimeConflictCheckerModel,
} from '@/data/protocols/date/time-conflict-checker'
import { areIntervalsOverlapping as areIntervalsOverlappingFunc } from 'date-fns'

type FormattedTimes = {
  startDateTime: Date
  endDateTime: Date
}

export class DateFnsAdapter implements TimeConflictChecker {
  private getFormattedTimes({ startTime, endTime }: ServiceHourTimeModel): FormattedTimes {
    const splittedStartTime = startTime.split(':').map(piece => Number(piece))
    const splittedEndTime = endTime.split(':').map(piece => Number(piece))

    const startDateTime = new Date()
    const endDateTime = new Date()

    startDateTime.setHours(splittedStartTime[0], splittedStartTime[1], 0, 0)
    endDateTime.setHours(splittedEndTime[0], splittedEndTime[1], 0, 0)

    return {
      startDateTime,
      endDateTime,
    }
  }

  isEndTimeGreaterThanStartTime({
    startTime: receivedStartTime,
    endTime: receivedEndTime,
  }: ServiceHourTimeModel): boolean {
    const { startDateTime, endDateTime } = this.getFormattedTimes({
      startTime: receivedStartTime,
      endTime: receivedEndTime,
    })

    return endDateTime.getTime() > startDateTime.getTime()
  }

  hasConflicts({ newTime, existingTimes }: TimeConflictCheckerModel): boolean {
    let areIntervalsOverlapping = false

    const formattedExistingTimes = existingTimes.map(interval => {
      const { startDateTime, endDateTime } = this.getFormattedTimes({
        startTime: interval.startTime,
        endTime: interval.endTime,
      })

      return {
        start: startDateTime,
        end: endDateTime,
      }
    })

    const { startDateTime: intervalNewStartTime, endDateTime: intervalNewEndTime } = this.getFormattedTimes({
      startTime: newTime.startTime,
      endTime: newTime.endTime,
    })

    const formattedNewInterval = {
      start: intervalNewStartTime,
      end: intervalNewEndTime,
    }

    formattedExistingTimes.forEach(storedInterval => {
      if (areIntervalsOverlappingFunc(formattedNewInterval, storedInterval, { inclusive: true })) {
        areIntervalsOverlapping = true
      }
    })

    return areIntervalsOverlapping
  }
}
