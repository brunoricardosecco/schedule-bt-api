export type ServiceHourTimeModel = {
  startTime: string
  endTime: string
}

export type TimeConflictCheckerModel = {
  newTime: ServiceHourTimeModel
  existingTimes: ServiceHourTimeModel[]
}

export type TimeOverlappingCheckerModel = {
  firstTime: {
    start: Date
    end: Date
  }
  secondTime: {
    start: Date
    end: Date
  }
}

export interface TimeConflictChecker {
  hasConflicts: ({ newTime, existingTimes }: TimeConflictCheckerModel) => boolean
  isEndTimeGreaterThanStartTime: ({ startTime, endTime }: ServiceHourTimeModel) => boolean
  areIntervalsOverlapping: ({ firstTime, secondTime }: TimeOverlappingCheckerModel, options?: { inclusive?: boolean }) => boolean
}
