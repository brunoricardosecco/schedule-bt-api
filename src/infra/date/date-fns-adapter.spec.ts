import { ServiceHourTimeModel } from '@/data/protocols/date/time-conflict-checker'
import { DateFnsAdapter } from './date-fns-adapter'

jest.useFakeTimers()
jest.setSystemTime(new Date())

const makeFakeServiceHourTimes = (): ServiceHourTimeModel => ({
  startTime: '09:00',
  endTime: '20:00'
})

const makeFakeWrongServiceHourTimes = (): ServiceHourTimeModel => ({
  startTime: '09:00',
  endTime: '08:00'
})

const makeFakeStoredServiceHours = (): ServiceHourTimeModel[] => ([
  {
    startTime: '09:00',
    endTime: '12:00'
  },
  {
    startTime: '13:00',
    endTime: '18:00'
  }
])

const makeSut = (): DateFnsAdapter => {
  return new DateFnsAdapter()
}

describe('date-fns Adapter', () => {
  describe('isEndTimeGraterThanStartTime', () => {
    it('should returns true on success', async () => {
      const sut = makeSut()

      const value = sut.isEndTimeGreaterThanStartTime(makeFakeServiceHourTimes())

      expect(value).toBeTruthy()
    })
    it('should returns false on wrong service hour times', () => {
      const sut = makeSut()

      const value = sut.isEndTimeGreaterThanStartTime(makeFakeWrongServiceHourTimes())

      expect(value).toBeFalsy()
    })
    it('should returns false on same service hour times', () => {
      const sut = makeSut()

      const value = sut.isEndTimeGreaterThanStartTime(makeFakeWrongServiceHourTimes())

      expect(value).toBeFalsy()
    })
  })
  describe('hasConflicts', () => {
    it('should returns true if the new service hour is conflicting with any stored', () => {
      const sut = makeSut()

      const value = sut.hasConflicts({
        newTime: {
          startTime: '17:00',
          endTime: '20:00'
        },
        existingTimes: makeFakeStoredServiceHours()
      })

      expect(value).toBeTruthy()
    })
    it('should returns true if the new service hour is overlapping all of the stored service hours', () => {
      const sut = makeSut()

      const value = sut.hasConflicts({
        newTime: {
          startTime: '07:00',
          endTime: '23:00'
        },
        existingTimes: makeFakeStoredServiceHours()
      })

      expect(value).toBeTruthy()
    })
    it('should returns false if the new service hour is not conflicting with any stored', () => {
      const sut = makeSut()

      const value = sut.hasConflicts({
        newTime: {
          startTime: '19:00',
          endTime: '20:00'
        },
        existingTimes: makeFakeStoredServiceHours()
      })

      expect(value).toBeFalsy()
    })
  })
})
