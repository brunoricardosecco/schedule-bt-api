import { mockTimeConflictChecker } from '@/test/data/date/mock-date'
import {
  mockAddServiceHourRepository,
  mockLoadServiceHoursByCompanyIdAndWeekdayRepository,
} from '@/test/data/db/mock-db-service-hour'
import { mockServiceHour, mockServiceHourData } from '@/test/domain/models/mock-service-hour'
import { AddServiceHour } from './add-service-hour'
import {
  AddServiceHourRepository,
  AddServiceHourRepositoryModel,
  IAddServiceHour,
  LoadServiceHoursByCompanyIdAndWeekdayRepository,
  TimeConflictChecker,
} from './add-service-hour.protocols'

type SutTypes = {
  addServiceHourRepository: AddServiceHourRepository
  loadServiceHoursByCompanyIdAndWeekdayRepository: LoadServiceHoursByCompanyIdAndWeekdayRepository
  timeConflictChecker: TimeConflictChecker
  sut: IAddServiceHour
}

const makeSut = (): SutTypes => {
  const addServiceHourRepository = mockAddServiceHourRepository()
  const loadServiceHoursByCompanyIdAndWeekdayRepository = mockLoadServiceHoursByCompanyIdAndWeekdayRepository()
  const timeConflictChecker = mockTimeConflictChecker()
  const sut = new AddServiceHour(
    addServiceHourRepository,
    loadServiceHoursByCompanyIdAndWeekdayRepository,
    timeConflictChecker
  )

  return {
    addServiceHourRepository,
    loadServiceHoursByCompanyIdAndWeekdayRepository,
    timeConflictChecker,
    sut,
  }
}

describe('AddServiceHour UseCase', () => {
  it('should call AddServiceHourRepository with correct values', async () => {
    const { addServiceHourRepository, sut } = makeSut()
    const addSpy = jest.spyOn(addServiceHourRepository, 'add')
    await sut.add(mockServiceHourData())

    expect(addSpy).toHaveBeenCalledWith(mockServiceHourData())
  })

  it('should throw if AddServiceHourRepository throws', async () => {
    const { addServiceHourRepository, sut } = makeSut()
    jest.spyOn(addServiceHourRepository, 'add').mockRejectedValueOnce(new Error())
    const promise = sut.add(mockServiceHourData())

    await expect(promise).rejects.toThrow()
  })

  it('should returns an service hour on success', async () => {
    const { sut } = makeSut()
    const serviceHour = await sut.add(mockServiceHourData())

    expect(serviceHour).toEqual(mockServiceHour())
  })

  it('should returns an error on trying to add a schedule that conflicts with another one on the same day', async () => {
    const { sut, timeConflictChecker } = makeSut()
    jest.spyOn(timeConflictChecker, 'hasConflicts').mockReturnValueOnce(true)
    const conflictingServiceHour: AddServiceHourRepositoryModel = {
      companyId: 'any_company_id',
      startTime: '10:00',
      endTime: '14:00',
      weekday: 0,
    }
    const error = await sut.add(conflictingServiceHour)

    expect(error).toEqual(
      new Error('O intervalo de tempo não pode conflitar com outro intervalo de tempo já cadastrado')
    )
  })

  it('should returns an error on trying to add an service hour with the start time greater than the end time', async () => {
    const { sut, timeConflictChecker } = makeSut()
    jest.spyOn(timeConflictChecker, 'isEndTimeGreaterThanStartTime').mockReturnValueOnce(false)
    const conflictingServiceHour: AddServiceHourRepositoryModel = {
      companyId: 'any_company_id',
      startTime: '10:00',
      endTime: '14:00',
      weekday: 0,
    }
    const error = await sut.add(conflictingServiceHour)

    expect(error).toEqual(new Error('O tempo de início precisa ser menor que o tempo de término'))
  })
})
