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

const makeSut = (): DateFnsAdapter => {
  return new DateFnsAdapter()
}

describe('date-fns Adapter', () => {
  it('should returns true on success', async () => {
    const sut = makeSut()

    const value = sut.isEndTimeGraterThanStartTime(makeFakeServiceHourTimes())

    expect(value).toBeTruthy()
  })
  it('should returns false on wrong service hour times', async () => {
    const sut = makeSut()

    const value = sut.isEndTimeGraterThanStartTime(makeFakeWrongServiceHourTimes())

    expect(value).toBeFalsy()
  })
})
