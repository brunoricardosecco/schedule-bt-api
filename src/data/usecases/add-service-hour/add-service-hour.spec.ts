import { AddServiceHour } from './add-service-hour'
import {
  AddServiceHourRepository,
  AddServiceHourRepositoryModel,
  ServiceHour,
  IAddServiceHour,
  LoadServiceHoursByCompanyIdAndWeekdayRepository,
  LoadServiceHoursByCompanyIdRepositoryModel,
  ServiceHourTimeModel,
  TimeConflictChecker
} from './add-service-hour.protocols'

const makeFakeServiceHour = (): ServiceHour => ({
  id: 'valid_id',
  companyId: 'company_id',
  startTime: '09:00',
  endTime: '12:00',
  weekday: 0
})

const makeFakeServiceHourData = (): AddServiceHourRepositoryModel => ({
  weekday: 0,
  startTime: '09:00',
  endTime: '12:00',
  companyId: 'company_id'
})

const makeAddServiceHourRepository = (): AddServiceHourRepository => {
  class AddServiceHourRepositoryStub implements AddServiceHourRepository {
    async add (
      serviceHourData: AddServiceHourRepositoryModel
    ): Promise<ServiceHour> {
      return await new Promise((resolve) => {
        resolve(makeFakeServiceHour())
      })
    }
  }

  return new AddServiceHourRepositoryStub()
}

const makeLoadServiceHoursByCompanyIdAndWeekday =
  (): LoadServiceHoursByCompanyIdAndWeekdayRepository => {
    class LoadServiceHoursByCompanyIdAndWeekdayRepositoryStub
    implements LoadServiceHoursByCompanyIdAndWeekdayRepository {
      async loadByCompanyIdAndWeekday ({
        companyId,
        weekday
      }: LoadServiceHoursByCompanyIdRepositoryModel): Promise<ServiceHour[]> {
        return await new Promise((resolve) => {
          resolve([makeFakeServiceHour()])
        })
      }
    }

    return new LoadServiceHoursByCompanyIdAndWeekdayRepositoryStub()
  }

const makeTimeConflictChecker = (): TimeConflictChecker => {
  class TimeConflictCheckerStub implements TimeConflictChecker {
    hasConflicts ({ newDateTime, storedDateTimes }: any): boolean {
      return false
    }

    isEndTimeGreaterThanStartTime ({
      startTime,
      endTime
    }: ServiceHourTimeModel): boolean {
      return true
    }
  }

  return new TimeConflictCheckerStub()
}

type SutTypes = {
  addServiceHourRepository: AddServiceHourRepository
  loadServiceHoursByCompanyIdAndWeekdayRepository: LoadServiceHoursByCompanyIdAndWeekdayRepository
  timeConflictChecker: TimeConflictChecker
  sut: IAddServiceHour
}

const makeSut = (): SutTypes => {
  const addServiceHourRepository = makeAddServiceHourRepository()
  const loadServiceHoursByCompanyIdAndWeekdayRepository =
    makeLoadServiceHoursByCompanyIdAndWeekday()
  const timeConflictChecker = makeTimeConflictChecker()
  const sut = new AddServiceHour(
    addServiceHourRepository,
    loadServiceHoursByCompanyIdAndWeekdayRepository,
    timeConflictChecker
  )

  return {
    addServiceHourRepository,
    loadServiceHoursByCompanyIdAndWeekdayRepository,
    timeConflictChecker,
    sut
  }
}

describe('AddServiceHour UseCase', () => {
  it('should call AddServiceHourRepository with correct values', async () => {
    const { addServiceHourRepository, sut } = makeSut()

    const addSpy = jest.spyOn(addServiceHourRepository, 'add')
    await sut.add(makeFakeServiceHourData())

    expect(addSpy).toHaveBeenCalledWith(makeFakeServiceHourData())
  })
  it('should throw if AddServiceHourRepository throws', async () => {
    const { addServiceHourRepository, sut } = makeSut()

    jest.spyOn(addServiceHourRepository, 'add').mockImplementationOnce(
      async () =>
        await new Promise((resolve, reject) => {
          reject(new Error())
        })
    )

    const promise = sut.add(makeFakeServiceHourData())

    await expect(promise).rejects.toThrow()
  })
  it('should returns an service hour on success', async () => {
    const { sut } = makeSut()

    const serviceHour = await sut.add(makeFakeServiceHourData())

    expect(serviceHour).toEqual(makeFakeServiceHour())
  })
  it('should returns an error on trying to add a schedule that conflicts with another one on the same day', async () => {
    const { sut, timeConflictChecker } = makeSut()

    jest.spyOn(timeConflictChecker, 'hasConflicts').mockReturnValueOnce(true)

    const conflictingServiceHour: AddServiceHourRepositoryModel = {
      companyId: 'company_id',
      startTime: '10:00',
      endTime: '14:00',
      weekday: 0
    }

    const error = await sut.add(conflictingServiceHour)

    expect(error).toEqual(
      new Error('O intervalo de tempo não pode conflitar com outro intervalo de tempo já cadastrado')
    )
  })
  it('should returns an error on trying to add an service hour with the start time greater than the end time', async () => {
    const { sut, timeConflictChecker } = makeSut()

    jest
      .spyOn(timeConflictChecker, 'isEndTimeGreaterThanStartTime')
      .mockReturnValueOnce(false)

    const conflictingServiceHour: AddServiceHourRepositoryModel = {
      companyId: 'company_id',
      startTime: '10:00',
      endTime: '14:00',
      weekday: 0
    }

    const error = await sut.add(conflictingServiceHour)

    expect(error).toEqual(new Error('O tempo de início precisa ser menor que o tempo de término'))
  })
})
