import { ServiceHourTimeModel, TimeConflictChecker } from '@/data/protocols/date/time-conflict-checker'
import { LoadServiceHoursByCompanyIdRepository, LoadServiceHoursByCompanyIdRepositoryModel } from '@/data/protocols/db/service-hour/load-service-hours-by-company-id'
import { Company } from '../add-company/db-add-company.protocols'
import { DbAddCompanyServiceHour } from './db-add-company-service-hour'
import { AddCompanyServiceHourRepository, AddCompanyServiceHourRepositoryModel, ServiceHour, AddCompanyServiceHour } from './db-add-company-service-hour.protocols'

const makeFakeCompany = (): Company => ({
  id: 'valid_id',
  name: 'verona',
  reservationPrice: 60,
  reservationTimeInMinutes: 60,
  createdAt: new Date(),
  updatedAt: new Date()
})

const makeFakeServiceHour = (): ServiceHour => ({
  id: 'valid_id',
  company: makeFakeCompany(),
  companyId: 'company_id',
  startTime: '09:00',
  endTime: '12:00',
  weekday: 0
})

const makeFakeServiceHourData = (): AddCompanyServiceHourRepositoryModel => ({
  weekday: 0,
  startTime: '09:00',
  endTime: '12:00',
  companyId: 'company_id'
})

const makeAddCompanyServiceHourRepository = (): AddCompanyServiceHourRepository => {
  class AddCompanyServiceHourRepositoryStub implements AddCompanyServiceHourRepository {
    async add (serviceHourData: AddCompanyServiceHourRepositoryModel): Promise<ServiceHour> {
      return await new Promise(resolve => { resolve(makeFakeServiceHour()) })
    }
  }

  return new AddCompanyServiceHourRepositoryStub()
}

const makeLoadServiceHoursByCompanyId = (): LoadServiceHoursByCompanyIdRepository => {
  class LoadServiceHoursByCompanyIdRepositoryStub implements LoadServiceHoursByCompanyIdRepository {
    async load ({ companyId, weekday }: LoadServiceHoursByCompanyIdRepositoryModel): Promise<ServiceHour[]> {
      return await new Promise(resolve => { resolve([makeFakeServiceHour()]) })
    }
  }

  return new LoadServiceHoursByCompanyIdRepositoryStub()
}

const makeTimeConflictChecker = (): TimeConflictChecker => {
  class TimeConflictCheckerStub implements TimeConflictChecker {
    hasConflicts ({ newDateTime, storedDateTimes }: any): boolean {
      return false
    }

    isEndTimeGraterThanStartTime ({ startTime, endTime }: ServiceHourTimeModel): boolean {
      return true
    }
  }

  return new TimeConflictCheckerStub()
}

type SutTypes = {
  addCompanyRepository: AddCompanyServiceHourRepository
  loadServiceHoursByCompanyIdRepository: LoadServiceHoursByCompanyIdRepository
  timeConflictChecker: TimeConflictChecker
  sut: AddCompanyServiceHour
}

const makeSut = (): SutTypes => {
  const addCompanyRepository = makeAddCompanyServiceHourRepository()
  const loadServiceHoursByCompanyIdRepository = makeLoadServiceHoursByCompanyId()
  const timeConflictChecker = makeTimeConflictChecker()
  const sut = new DbAddCompanyServiceHour(addCompanyRepository, loadServiceHoursByCompanyIdRepository, timeConflictChecker)

  return {
    addCompanyRepository,
    loadServiceHoursByCompanyIdRepository,
    timeConflictChecker,
    sut
  }
}

describe('DbAddCompanyServiceHour Usecase', () => {
  it('should call AddCompanyServiceHourRepository with correct values', async () => {
    const { addCompanyRepository, sut } = makeSut()

    const addSpy = jest.spyOn(addCompanyRepository, 'add')
    await sut.add(makeFakeServiceHourData())

    expect(addSpy).toHaveBeenCalledWith(makeFakeServiceHourData())
  })
  it('should throw if AddCompanyServiceHourRepository throws', async () => {
    const { addCompanyRepository, sut } = makeSut()

    jest.spyOn(addCompanyRepository, 'add').mockImplementationOnce(async () => await new Promise((resolve, reject) => { reject(new Error()) }))

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

    const conflictingServiceHour: AddCompanyServiceHourRepositoryModel = {
      companyId: 'company_id',
      startTime: '10:00',
      endTime: '14:00',
      weekday: 0
    }

    const error = await sut.add(conflictingServiceHour)

    expect(error).toEqual(new Error('New service hour is conflicting with another'))
  })
  it('should returns an error on trying to add an service hour with the start time greater than the end time', async () => {
    const { sut, timeConflictChecker } = makeSut()

    jest.spyOn(timeConflictChecker, 'isEndTimeGraterThanStartTime').mockReturnValueOnce(false)

    const conflictingServiceHour: AddCompanyServiceHourRepositoryModel = {
      companyId: 'company_id',
      startTime: '10:00',
      endTime: '14:00',
      weekday: 0
    }

    const error = await sut.add(conflictingServiceHour)

    expect(error).toEqual(new Error('Start time must be lower than end time'))
  })
})
