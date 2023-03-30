import { db } from '../../orm/prisma'
import { ServiceHourPostgresRepository } from './service-hour-postgres-repository'

const makeSut = (): ServiceHourPostgresRepository => {
  return new ServiceHourPostgresRepository()
}

describe('Service Hour Postgres Repository', () => {
  afterAll(async () => {
    const deleteServiceHours = db.serviceHours.deleteMany()
    const deleteCompanies = db.companies.deleteMany()
    await db.$transaction([
      deleteServiceHours,
      deleteCompanies
    ])
    await db.$disconnect()
  })

  afterAll(async () => {
    const deleteServiceHours = db.serviceHours.deleteMany()
    const deleteCompanies = db.companies.deleteMany()
    await db.$transaction([
      deleteServiceHours,
      deleteCompanies
    ])
  })

  it('should return an service hour on success', async () => {
    const sut = makeSut()

    const company = await db.companies.create({
      data: {
        name: 'any_name',
        reservationPrice: 60,
        reservationTimeInMinutes: 80
      }
    })

    const params = {
      weekday: 0,
      startTime: '09:00',
      endTime: '20:00',
      companyId: company.id
    }

    const serviceHour = await sut.add(params)

    expect(serviceHour).toBeTruthy()
    expect(serviceHour.id).toBeTruthy()
    expect(serviceHour.weekday).toEqual(params.weekday)
    expect(serviceHour.startTime).toEqual(params.startTime)
    expect(serviceHour.endTime).toEqual(params.endTime)
    expect(serviceHour.companyId).toEqual(params.companyId)
  })
  it('should return service hours on loadByCompanyIdAndWeekday success', async () => {
    const sut = makeSut()

    const company = await db.companies.create({
      data: {
        name: 'any_name',
        reservationPrice: 60,
        reservationTimeInMinutes: 80
      }
    })

    await db.serviceHours.create({
      data: {
        weekday: 0,
        startTime: '09:00',
        endTime: '20:00',
        companyId: company.id
      }
    })

    const serviceHours = await sut.loadByCompanyIdAndWeekday({
      companyId: company.id,
      weekday: 0
    })

    expect(serviceHours.length).toBeGreaterThan(0)
    expect(serviceHours[0]).toEqual({
      weekday: 0,
      startTime: '09:00',
      endTime: '20:00',
      companyId: company.id,
      id: expect.any(String)
    })
  })
  it('should return an empty array if there is no service hour for a specific companyId', async () => {
    const sut = makeSut()

    const company = await db.companies.create({
      data: {
        name: 'any_name',
        reservationPrice: 60,
        reservationTimeInMinutes: 80
      }
    })

    const serviceHours = await sut.loadByCompanyIdAndWeekday({
      companyId: company.id,
      weekday: 0
    })

    expect(serviceHours.length).toEqual(0)
  })
})
