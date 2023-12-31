import { mockServiceHourTimes, mockStoredServiceHours, mockWrongServiceHourTimes } from '@/test/domain/models/mock-date'
import { DateFnsAdapter } from './date-fns-adapter'

jest.useFakeTimers()
jest.setSystemTime(new Date())

const makeSut = (): DateFnsAdapter => {
  return new DateFnsAdapter()
}

describe('date-fns Adapter', () => {
  describe('isEndTimeGraterThanStartTime', () => {
    it('should returns true on success', async () => {
      const sut = makeSut()

      const value = sut.isEndTimeGreaterThanStartTime(mockServiceHourTimes())

      expect(value).toBeTruthy()
    })

    it('should returns false on wrong service hour times', () => {
      const sut = makeSut()

      const value = sut.isEndTimeGreaterThanStartTime(mockWrongServiceHourTimes())

      expect(value).toBeFalsy()
    })

    it('should returns false on same service hour times', () => {
      const sut = makeSut()

      const value = sut.isEndTimeGreaterThanStartTime(mockWrongServiceHourTimes())

      expect(value).toBeFalsy()
    })
  })

  describe('hasConflicts', () => {
    it('should returns true if the new service hour is conflicting with any stored', () => {
      const sut = makeSut()

      const value = sut.hasConflicts({
        newTime: {
          startTime: '17:00',
          endTime: '20:00',
        },
        existingTimes: mockStoredServiceHours(),
      })

      expect(value).toBeTruthy()
    })

    it('should returns true if the new service hour is overlapping all of the stored service hours', () => {
      const sut = makeSut()

      const value = sut.hasConflicts({
        newTime: {
          startTime: '07:00',
          endTime: '23:00',
        },
        existingTimes: mockStoredServiceHours(),
      })

      expect(value).toBeTruthy()
    })

    it('should returns false if the new service hour is not conflicting with any stored', () => {
      const sut = makeSut()

      const value = sut.hasConflicts({
        newTime: {
          startTime: '19:00',
          endTime: '20:00',
        },
        existingTimes: mockStoredServiceHours(),
      })

      expect(value).toBeFalsy()
    })
  })
})
