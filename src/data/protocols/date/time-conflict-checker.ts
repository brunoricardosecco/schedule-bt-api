export type ServiceHourTimeModel = {
  startTime: string
  endTime: string
}

export type TimeConflictCheckerModel = {
  newTime: ServiceHourTimeModel
  existingTimes: ServiceHourTimeModel[]
}

export interface TimeConflictChecker {
  hasConflicts: ({ newTime, existingTimes }: TimeConflictCheckerModel) => boolean
  isEndTimeGraterThanStartTime: ({ startTime, endTime }: ServiceHourTimeModel) => boolean
}
