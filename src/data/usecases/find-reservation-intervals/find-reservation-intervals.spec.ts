import { FindCompaniesRepository, FindCompaniesRepositoryParams } from '@/data/protocols/db/company/find-company-repository'
import { IFindReservationIntervals } from '@/domain/usecases/find-reservation-intervals'
import { Company } from '../add-company/db-add-company.protocols'
import { FindServiceHoursRepository, FindServiceHoursRepositoryParams, ServiceHour } from '../find-service-hours/find-service-hours.protocols'
import { FindReservationIntervals } from './find-reservation-intervals'
import { Reservation } from '@/domain/models/reservation'
import { ReservationStatus } from '@prisma/client'
import { FindReservationsRepository, FindReservationsRepositoryParams } from '@/data/protocols/db/reservation/find-reservation-repository'

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
  reservationDate: new Date(),
  reservationPrice: 0,
  reservationStatus: ReservationStatus.AWAITING_PAYMENT,
  createdAt: new Date(),
  updatedAt: new Date()
})
const fakeReservation = makeFakeReservation()

const makeFindReservationsRepository = (): FindReservationsRepository => {
  class FindReservationRepositoryStub implements FindReservationsRepository {
    async findBy (params: FindReservationsRepositoryParams): Promise<Reservation[]> {
      return await new Promise(resolve => { resolve([fakeReservation]) })
    }
  }
  return new FindReservationRepositoryStub()
}

const makeFindServiceHoursRepository = (): FindServiceHoursRepository => {
  class FindServiceHoursRepositoryStub implements FindServiceHoursRepository {
    async findBy (params: FindServiceHoursRepositoryParams): Promise<ServiceHour[]> {
      return await new Promise(resolve => { resolve([fakeServiceHour]) })
    }
  }

  return new FindServiceHoursRepositoryStub()
}

const makeFindCompaniesRepository = (): FindCompaniesRepository => {
  class FindCompaniesRepositoryStub implements FindCompaniesRepository {
    async findBy (params: FindCompaniesRepositoryParams): Promise<Company[]> {
      return await new Promise(resolve => { resolve([fakeCompany]) })
    }
  }

  return new FindCompaniesRepositoryStub()
}

type SutTypes = {
  sut: IFindReservationIntervals
  findServiceHoursRepository: FindServiceHoursRepository
  findCompanyRepository: FindCompaniesRepository
  findReservationsRepository: FindReservationsRepository
}

const makeSut = (): SutTypes => {
  const findServiceHoursRepositoryStub = makeFindServiceHoursRepository()
  const findCompanyRepositoryStub = makeFindCompaniesRepository()
  const findReservationsRepositoryStub = makeFindReservationsRepository()
  const sut = new FindReservationIntervals(findServiceHoursRepositoryStub, findCompanyRepositoryStub, findReservationsRepositoryStub)

  return {
    sut,
    findServiceHoursRepository: findServiceHoursRepositoryStub,
    findCompanyRepository: findCompanyRepositoryStub,
    findReservationsRepository: findReservationsRepositoryStub
  }
}

describe('FindReservationIntervals', () => {
  it('should calls FindServiceHoursRepository with correct values', async () => {
    const { findServiceHoursRepository, sut } = makeSut()
    const findBySpy = jest.spyOn(findServiceHoursRepository, 'findBy')
    const params = {
      date: new Date(),
      companyId: 'any_company_id'
    }

    await sut.find(params)

    expect(findBySpy).toHaveBeenCalledWith({ companyId: 'any_company_id', weekday: params.date.getDay() })
  })
  it('should calls FindCompaniesRepository with correct values', async () => {
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
    jest.spyOn(findServiceHoursRepository, 'findBy').mockImplementationOnce(async () => await new Promise((resolve, reject) => { reject(new Error()) }))
    const params = {
      date: new Date(),
      companyId: 'any_company_id'
    }

    const promise = sut.find(params)

    await expect(promise).rejects.toThrow()
  })
  it('should throw if FindCompaniesRepository throws', async () => {
    const { findCompanyRepository, sut } = makeSut()
    jest.spyOn(findCompanyRepository, 'findBy').mockImplementationOnce(async () => await new Promise((resolve, reject) => { reject(new Error()) }))
    const params = {
      date: new Date(),
      companyId: 'any_company_id'
    }

    const promise = sut.find(params)

    await expect(promise).rejects.toThrow()
  })
  it("should return an error if the company doesn't have any stored service hour", async () => {
    const { findServiceHoursRepository, sut } = makeSut()
    jest.spyOn(findServiceHoursRepository, 'findBy').mockImplementationOnce(async () => await new Promise((resolve) => { resolve([]) }))
    const params = {
      date: new Date(),
      companyId: 'any_company_id'
    }

    const error = await sut.find(params)

    expect(error).toEqual(new Error('A empresa não possui horários de trabalhos cadastrados neste dia'))
  })
  it("should return an error if the doesn't find a company", async () => {
    const { findCompanyRepository, sut } = makeSut()
    jest.spyOn(findCompanyRepository, 'findBy').mockImplementationOnce(async () => await new Promise((resolve) => { resolve([]) }))
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

    expect(findBySpy).toHaveBeenCalledWith({ companyId: 'any_company_id', startAt: new Date(params.date.setHours(0, 0, 0, 0)), endAt: new Date(params.date.setHours(23, 59, 59, 999)) })
  })
})
