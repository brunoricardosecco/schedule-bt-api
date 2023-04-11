import { ServiceHour } from '@/domain/models/service-hour'

type FormattedTimes = {
  start: Date
  end: Date
}

export const getServiceHourTimeFormatted = (serviceHour: ServiceHour): FormattedTimes => {
  const rawDate = new Date().toISOString().slice(0, 10)
  // Doing it to pass on the date constructor something like '2023-04-11,09:00'
  const intervalStart = new Date([rawDate, serviceHour.startTime].toString())
  const intervalEnd = new Date([rawDate, serviceHour.endTime].toString())

  return {
    start: intervalStart,
    end: intervalEnd
  }
}
