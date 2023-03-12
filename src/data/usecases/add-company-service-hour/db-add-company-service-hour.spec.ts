import { AddCompanyServiceHourRepository, AddCompanyServiceHourRepositoryModel } from '@/data/protocols/db/service-hour/add-company-service-hour'
import { ServiceHour } from '@/domain/models/serviceHour'
import { AddCompanyServiceHour } from '@/domain/usecases/add-company-service-hour'
import { Company } from '../add-company/db-add-company.protocols'
import { DbAddCompanyServiceHour } from './db-add-company-service-hour'

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
  endTime: '22:00',
  weekday: 0
})

const makeFakeServiceHourData = (): AddCompanyServiceHourRepositoryModel => ({
  weekday: 0,
  startTime: '09:00',
  endTime: '22:00',
  companyId: 'company_id'
})

class AddCompanyServiceHourRepositoryStub implements AddCompanyServiceHourRepository {
  async add (serviceHourData: AddCompanyServiceHourRepositoryModel): Promise<ServiceHour> {
    return await new Promise(resolve => { resolve(makeFakeServiceHour()) })
  }
}

type SutTypes = {
  addCompanyRepository: AddCompanyServiceHourRepository
  sut: AddCompanyServiceHour
}

const makeSut = (): SutTypes => {
  const addCompanyRepository = new AddCompanyServiceHourRepositoryStub()
  const sut = new DbAddCompanyServiceHour(addCompanyRepository)

  return {
    addCompanyRepository,
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

    jest.spyOn(addCompanyRepository, 'add').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))

    const promise = sut.add(makeFakeServiceHourData())

    await expect(promise).rejects.toThrow()
  })
  it('should returns an service hour on success', async () => {
    const { sut } = makeSut()

    const serviceHour = await sut.add(makeFakeServiceHourData())

    expect(serviceHour).toEqual(makeFakeServiceHour())
  })
})
