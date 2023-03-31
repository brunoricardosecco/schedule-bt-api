import { FindCompaniesRepository, FindCompaniesRepositoryParams } from '@/data/protocols/db/company/find-company-repository'
import { IFindReservationIntervals } from '@/domain/usecases/find-reservation-intervals'
import { Company } from '../add-company/db-add-company.protocols'
import { FindServiceHoursRepository, FindServiceHoursRepositoryParams, ServiceHour } from '../find-service-hours/find-service-hours.protocols'
import { FindReservationIntervals } from './find-reservation-intervals'

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
}

const makeSut = (): SutTypes => {
  const findServiceHoursRepositoryStub = makeFindServiceHoursRepository()
  const findCompanyRepositoryStub = makeFindCompaniesRepository()
  const sut = new FindReservationIntervals(findServiceHoursRepositoryStub, findCompanyRepositoryStub)

  return {
    sut,
    findServiceHoursRepository: findServiceHoursRepositoryStub,
    findCompanyRepository: findCompanyRepositoryStub
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

    expect(findBySpy).toHaveBeenCalledWith({ companyId: 'any_company_id', weekday: new Date().getDay() })
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
})
