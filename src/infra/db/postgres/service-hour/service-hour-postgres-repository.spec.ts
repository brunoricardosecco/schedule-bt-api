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
})
