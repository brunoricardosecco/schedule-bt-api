import { ServiceHour } from '@/domain/models/service-hour'

type FormattedTimes = {
  start: Date
  end: Date
}

export const getServiceHourTimeFormatted = (serviceHour: ServiceHour): FormattedTimes => {
  const splittedStartTime = serviceHour.startTime
    .split(':')
    .map((piece) => Number(piece))
  const splittedEndTime = serviceHour.endTime.split(':').map((piece) => Number(piece))
  const intervalStart = new Date(new Date().setHours(splittedStartTime[0], splittedStartTime[1], 0, 0))
  const intervalEnd = new Date(new Date().setHours(splittedEndTime[0], splittedEndTime[1], 0, 0))

  return {
    start: intervalStart,
    end: intervalEnd
  }
}
