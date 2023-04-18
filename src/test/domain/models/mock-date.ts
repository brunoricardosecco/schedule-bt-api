import { ServiceHourTimeModel } from '@/data/protocols/date/time-conflict-checker'

export const mockServiceHourTimes = (): ServiceHourTimeModel => ({
  startTime: '09:00',
  endTime: '20:00',
})

export const mockWrongServiceHourTimes = (): ServiceHourTimeModel => ({
  startTime: '09:00',
  endTime: '08:00',
})

export const mockStoredServiceHours = (): ServiceHourTimeModel[] => [
  { startTime: '09:00', endTime: '12:00' },
  { startTime: '13:00', endTime: '18:00' },
]
