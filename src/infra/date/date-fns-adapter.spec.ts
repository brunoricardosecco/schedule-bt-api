import { ServiceHourTimeModel } from '@/data/protocols/date/time-conflict-checker'
import dateFns from 'date-fns'
import { DateFnsAdapter } from './date-fns-adapter'

jest.useFakeTimers()
jest.setSystemTime(new Date())

jest.mock('date-fns', () => ({
  compareAsc (dateLeft: Date, dateRight: Date): number {
    return -1
  }
}))

type ConvertedDateTimes = {
  startTime: Date
  endTime: Date
}

const makeFakeServiceHourTimes = (): ServiceHourTimeModel => ({
  startTime: '09:00',
  endTime: '20:00'
})

const makeFakeConvertedDateTime = (): ConvertedDateTimes => {
  const startDateTime = new Date()
  startDateTime.setHours(9, 0)
  const endDateTime = new Date()
  endDateTime.setHours(20, 0)

  return {
    startTime: startDateTime,
    endTime: endDateTime
  }
}

const makeSut = (): DateFnsAdapter => {
  return new DateFnsAdapter()
}

describe('date-fns Adapter', () => {
  describe('compareAsc', () => {
    it('should call compareAsc with correct values', () => {
      const sut = makeSut()

      const compareAscSpy = jest.spyOn(dateFns, 'compareAsc')

      sut.isEndTimeGraterThanStartTime(makeFakeServiceHourTimes())

      const convertedTimesToDateTimes = makeFakeConvertedDateTime()

      expect(compareAscSpy).toHaveBeenCalledWith(convertedTimesToDateTimes.startTime, convertedTimesToDateTimes.endTime)
    })
  })
})
