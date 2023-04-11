import {
  FindCompaniesRepository, IFindReservationSlots, FindServiceHoursRepository, FindReservationsRepository, TimeConflictChecker, FindCompaniesRepositoryParams, FindServiceHoursRepositoryParams,
  FindReservationsRepositoryParams, ServiceHourTimeModel,
  TimeOverlappingCheckerModel
} from './find-reservation-slots.protocols'
import { Company } from '@/domain/models/company'
import { ServiceHour } from '@/domain/models/service-hour'
import { FindReservationSlots } from './find-reservation-slots'
import { Reservation } from '@/domain/models/reservation'
import { ReservationStatusEnum } from '@/domain/enums/reservation-status-enum'

jest.useFakeTimers()
jest.setSystemTime(new Date('2023-04-10,09:00'))

const makeFakeServiceHour = (): ServiceHour => ({
  id: 'valid_id',
  companyId: 'company_id',
  startTime: '09:00',
  endTime: '12:00',
  weekday: 0
})
const fakeServiceHour = makeFakeServiceHour()

const makeFakeCompany = (): Company => ({
  id: 'valid_id',
  name: 'verona',
  reservationPrice: 60,
  reservationTimeInMinutes: 60,
  createdAt: new Date(),
  updatedAt: new Date()
})
const fakeCompany = makeFakeCompany()

const makeFakeReservation = (): Reservation => ({
  id: 'any_id',
  accountId: 'account_id',
  companyId: 'company_id',
  description: '',
  reservationStartDateTime: new Date(new Date().setHours(10, 0, 0, 0)),
  reservationEndDateTime: new Date(new Date().setHours(11, 0, 0, 0)),
  reservationPrice: 0,
  reservationStatus: ReservationStatusEnum.AWAITING_PAYMENT,
  createdAt: new Date(),
  updatedAt: new Date()
})
const fakeReservation = makeFakeReservation()

const makeFindReservationsRepository = (): FindReservationsRepository => {
  class FindReservationRepositoryStub implements FindReservationsRepository {
    async findBy (
      params: FindReservationsRepositoryParams
    ): Promise<Reservation[]> {
      return []
    }
  }
  return new FindReservationRepositoryStub()
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

    areIntervalsOverlapping ({ firstTime, secondTime }: TimeOverlappingCheckerModel): boolean {
      return false
    }
  }

  return new TimeConflictCheckerStub()
}

const makeFindServiceHoursRepository = (): FindServiceHoursRepository => {
  class FindServiceHoursRepositoryStub implements FindServiceHoursRepository {
    async findBy (
      params: FindServiceHoursRepositoryParams
    ): Promise<ServiceHour[]> {
      return await new Promise((resolve) => {
        resolve([fakeServiceHour])
      })
    }
  }

  return new FindServiceHoursRepositoryStub()
}

const makeFindCompaniesRepository = (): FindCompaniesRepository => {
  class FindCompaniesRepositoryStub implements FindCompaniesRepository {
    async findBy (params: FindCompaniesRepositoryParams): Promise<Company[]> {
      return await new Promise((resolve) => {
        resolve([fakeCompany])
      })
    }
  }

  return new FindCompaniesRepositoryStub()
}

type SutTypes = {
  sut: IFindReservationSlots
  findServiceHoursRepository: FindServiceHoursRepository
  findCompanyRepository: FindCompaniesRepository
  findReservationsRepository: FindReservationsRepository
  timeConflictChecker: TimeConflictChecker
}

const makeSut = (): SutTypes => {
  const findServiceHoursRepositoryStub = makeFindServiceHoursRepository()
  const findCompanyRepositoryStub = makeFindCompaniesRepository()
  const findReservationsRepositoryStub = makeFindReservationsRepository()
  const timeConflictChecker = makeTimeConflictChecker()
  const sut = new FindReservationSlots(
    findServiceHoursRepositoryStub,
    findCompanyRepositoryStub,
    findReservationsRepositoryStub,
    timeConflictChecker
  )

  return {
    sut,
    findServiceHoursRepository: findServiceHoursRepositoryStub,
    findCompanyRepository: findCompanyRepositoryStub,
    findReservationsRepository: findReservationsRepositoryStub,
    timeConflictChecker
  }
}

describe('FindReservationSlots', () => {
  it('should call FindServiceHoursRepository with correct values', async () => {
    const { findServiceHoursRepository, sut } = makeSut()
    const findBySpy = jest.spyOn(findServiceHoursRepository, 'findBy')
    const params = {
      date: new Date(),
      companyId: 'any_company_id'
    }

    await sut.find(params)

    expect(findBySpy).toHaveBeenCalledWith({
      companyId: 'any_company_id',
      weekday: params.date.getDay()
    })
  })
  it('should call FindCompaniesRepository with correct values', async () => {
    const { findCompanyRepository, sut } = makeSut()
    const findBySpy = jest.spyOn(findCompanyRepository, 'findBy')
    const params = {
      date: new Date(),
      companyId: 'any_company_id'
    }

    await sut.find(params)

    expect(findBySpy).toHaveBeenCalledWith({ companyId: 'any_company_id' })
  })
  it('should throw if FindServiceHoursRepository throws', async () => {
    const { findServiceHoursRepository, sut } = makeSut()
    jest.spyOn(findServiceHoursRepository, 'findBy').mockImplementationOnce(
      async () =>
        await new Promise((resolve, reject) => {
          reject(new Error())
        })
    )
    const params = {
      date: new Date(),
      companyId: 'any_company_id'
    }

    const promise = sut.find(params)

    await expect(promise).rejects.toThrow()
  })
  it('should throw if FindCompaniesRepository throws', async () => {
    const { findCompanyRepository, sut } = makeSut()
    jest.spyOn(findCompanyRepository, 'findBy').mockImplementationOnce(
      async () =>
        await new Promise((resolve, reject) => {
          reject(new Error())
        })
    )
    const params = {
      date: new Date(),
      companyId: 'any_company_id'
    }

    const promise = sut.find(params)

    await expect(promise).rejects.toThrow()
  })
  it("should return an error if the company doesn't have any stored service hour", async () => {
    const { findServiceHoursRepository, sut } = makeSut()
    jest.spyOn(findServiceHoursRepository, 'findBy').mockImplementationOnce(
      async () =>
        await new Promise((resolve) => {
          resolve([])
        })
    )
    const params = {
      date: new Date(),
      companyId: 'any_company_id'
    }

    const error = await sut.find(params)

    expect(error).toEqual(
      new Error(
        'A empresa não possui horários de trabalhos cadastrados neste dia'
      )
    )
  })
  it("should return an error if the doesn't find a company", async () => {
    const { findCompanyRepository, sut } = makeSut()
    jest.spyOn(findCompanyRepository, 'findBy').mockImplementationOnce(
      async () =>
        await new Promise((resolve) => {
          resolve([])
        })
    )
    const params = {
      date: new Date(),
      companyId: 'any_company_id'
    }

    const error = await sut.find(params)

    expect(error).toEqual(new Error('Erro ao buscar empresa'))
  })
  it('should call FindReservationsRepository with correct values', async () => {
    const { findReservationsRepository, sut } = makeSut()
    const findBySpy = jest.spyOn(findReservationsRepository, 'findBy')
    const params = {
      date: new Date(),
      companyId: 'any_company_id'
    }

    await sut.find(params)

    expect(findBySpy).toHaveBeenCalledWith({
      companyId: 'any_company_id',
      startAt: new Date(params.date.setHours(0, 0, 0, 0)),
      endAt: new Date(params.date.setHours(23, 59, 59, 999))
    })
  })
  it('should throw if FindReservationsRepository throws', async () => {
    const { findReservationsRepository, sut } = makeSut()
    jest.spyOn(findReservationsRepository, 'findBy').mockImplementationOnce(
      async () =>
        await new Promise((resolve, reject) => {
          reject(new Error())
        })
    )
    const params = {
      date: new Date(),
      companyId: 'any_company_id'
    }

    const promise = sut.find(params)

    await expect(promise).rejects.toThrow()
  })
  it('should return the reservation slots for a given date', async () => {
    const { sut } = makeSut()

    const params = {
      date: new Date(),
      companyId: 'any_company_id'
    }

    const reservationSlots = await sut.find(params)

    expect(reservationSlots).toEqual([
      {
        start: '12:00',
        end: '13:00',
        isAvailable: true
      },
      {
        start: '13:00',
        end: '14:00',
        isAvailable: true
      },
      {
        start: '14:00',
        end: '15:00',
        isAvailable: true
      }
    ])
  })
  it('should set an slot as unavailable when there is a scheduled reservation for a specific slot', async () => {
    const { sut, findReservationsRepository, timeConflictChecker } = makeSut()
    jest
      .spyOn(findReservationsRepository, 'findBy')
      .mockResolvedValueOnce([fakeReservation])
    jest.spyOn(timeConflictChecker, 'areIntervalsOverlapping').mockReturnValueOnce(false).mockReturnValueOnce(true).mockReturnValueOnce(false)

    const params = {
      date: new Date(),
      companyId: 'any_company_id'
    }

    const reservationSlots = await sut.find(params)

    expect(reservationSlots).toEqual([
      {
        start: '12:00',
        end: '13:00',
        isAvailable: true
      },
      {
        start: '13:00',
        end: '14:00',
        isAvailable: false
      },
      {
        start: '14:00',
        end: '15:00',
        isAvailable: true
      }
    ])
  })
})
