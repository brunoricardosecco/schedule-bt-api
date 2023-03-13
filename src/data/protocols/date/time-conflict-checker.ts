type DateTime = {
  startTime: string
  endTime: string
}

export type TimeConflictCheckerModel = {
  newTime: DateTime
  existingTimes: DateTime[]
}

export interface TimeConflictChecker {
  hasConflicts: ({ newTime, existingTimes }: TimeConflictCheckerModel) => boolean
}
