import { mockTimeConflictChecker } from '@/test/data/date/mock-date'
import { mockFindReservationsRepository } from '@/test/data/db/mock-db-reservation'
import { mockFindServiceHoursRepository } from '@/test/data/db/mock-db-service-hour'
import { mockeReservation } from '@/test/domain/models/mock-reservation'
import { mockFindCompaniesRepository } from '@/test/domain/usecases/mock-find-company-repository'
import { FindReservationSlots } from './find-reservation-slots'
import {
  FindCompaniesRepository,
  FindReservationsRepository,
  FindServiceHoursRepository,
  IFindReservationSlots,
  TimeConflictChecker,
} from './find-reservation-slots.protocols'

jest.useFakeTimers()
jest.setSystemTime(new Date('2023-04-10,09:00'))

const params = { date: new Date(), companyId: 'any_company_id' }

type SutTypes = {
  sut: IFindReservationSlots
  findServiceHoursRepository: FindServiceHoursRepository
  findCompanyRepository: FindCompaniesRepository
  findReservationsRepository: FindReservationsRepository
  timeConflictChecker: TimeConflictChecker
}

const makeSut = (): SutTypes => {
  const findServiceHoursRepositoryStub = mockFindServiceHoursRepository()
  const findCompanyRepositoryStub = mockFindCompaniesRepository()
  const findReservationsRepositoryStub = mockFindReservationsRepository()
  const timeConflictChecker = mockTimeConflictChecker()
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
    timeConflictChecker,
  }
}

describe('FindReservationSlots', () => {
  it('should call FindServiceHoursRepository with correct values', async () => {
    const { findServiceHoursRepository, sut } = makeSut()
    const findBySpy = jest.spyOn(findServiceHoursRepository, 'findBy')
    const params = { date: new Date(), companyId: 'any_company_id' }
    await sut.find(params)

    expect(findBySpy).toHaveBeenCalledWith({
      companyId: 'any_company_id',
      weekday: params.date.getDay(),
    })
  })

  it('should call FindCompaniesRepository with correct values', async () => {
    const { findCompanyRepository, sut } = makeSut()
    const findBySpy = jest.spyOn(findCompanyRepository, 'findBy')

    await sut.find(params)

    expect(findBySpy).toHaveBeenCalledWith({ companyId: 'any_company_id' })
  })

  it('should throw if FindServiceHoursRepository throws', async () => {
    const { findServiceHoursRepository, sut } = makeSut()
    jest.spyOn(findServiceHoursRepository, 'findBy').mockRejectedValueOnce(new Error())
    const promise = sut.find(params)

    await expect(promise).rejects.toThrow()
  })

  it('should throw if FindCompaniesRepository throws', async () => {
    const { findCompanyRepository, sut } = makeSut()
    jest.spyOn(findCompanyRepository, 'findBy').mockRejectedValueOnce(new Error())
    const promise = sut.find(params)

    await expect(promise).rejects.toThrow()
  })

  it("should return an error if the company doesn't have any stored service hour", async () => {
    const { findServiceHoursRepository, sut } = makeSut()
    jest.spyOn(findServiceHoursRepository, 'findBy').mockResolvedValueOnce([])
    const error = await sut.find(params)

    expect(error).toEqual(new Error('A empresa não possui horários de trabalhos cadastrados neste dia'))
  })

  it("should return an error if the doesn't find a company", async () => {
    const { findCompanyRepository, sut } = makeSut()
    jest.spyOn(findCompanyRepository, 'findBy').mockResolvedValueOnce([])
    const error = await sut.find(params)

    expect(error).toEqual(new Error('Erro ao buscar empresa'))
  })

  it('should call FindReservationsRepository with correct values', async () => {
    const { findReservationsRepository, sut } = makeSut()
    const findBySpy = jest.spyOn(findReservationsRepository, 'findBy')
    await sut.find(params)

    expect(findBySpy).toHaveBeenCalledWith({
      companyId: 'any_company_id',
      startAt: new Date(params.date.setHours(0, 0, 0, 0)),
      endAt: new Date(params.date.setHours(23, 59, 59, 999)),
    })
  })

  it('should throw if FindReservationsRepository throws', async () => {
    const { findReservationsRepository, sut } = makeSut()
    jest.spyOn(findReservationsRepository, 'findBy').mockRejectedValueOnce(new Error())
    const promise = sut.find(params)

    await expect(promise).rejects.toThrow()
  })

  it('should return the reservation slots for a given date', async () => {
    const { sut } = makeSut()
    const reservationSlots = await sut.find(params)

    expect(reservationSlots).toEqual([
      { start: '12:00', end: '13:00', isAvailable: true },
      { start: '13:00', end: '14:00', isAvailable: true },
      { start: '14:00', end: '15:00', isAvailable: true },
    ])
  })

  it('should set an slot as unavailable when there is a scheduled reservation for a specific slot', async () => {
    const { sut, findReservationsRepository, timeConflictChecker } = makeSut()
    jest.spyOn(findReservationsRepository, 'findBy').mockResolvedValueOnce([mockeReservation()])
    jest
      .spyOn(timeConflictChecker, 'areIntervalsOverlapping')
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
    const reservationSlots = await sut.find(params)

    expect(reservationSlots).toEqual([
      { start: '12:00', end: '13:00', isAvailable: true },
      { start: '13:00', end: '14:00', isAvailable: false },
      { start: '14:00', end: '15:00', isAvailable: true },
    ])
  })
})
