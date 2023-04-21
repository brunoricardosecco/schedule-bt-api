import {
  ServiceHourTimeModel,
  TimeConflictChecker,
  TimeOverlappingCheckerModel,
} from '@/data/protocols/date/time-conflict-checker'

export const mockTimeConflictChecker = (): TimeConflictChecker => {
  class TimeConflictCheckerStub implements TimeConflictChecker {
    hasConflicts({ newDateTime, storedDateTimes }: any): boolean {
      return false
    }

    isEndTimeGreaterThanStartTime({ startTime, endTime }: ServiceHourTimeModel): boolean {
      return true
    }

    areIntervalsOverlapping({ firstTime, secondTime }: TimeOverlappingCheckerModel): boolean {
      return false
    }
  }

  return new TimeConflictCheckerStub()
}
