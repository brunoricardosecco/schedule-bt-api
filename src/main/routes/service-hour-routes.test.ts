import request from 'supertest'
import { db } from '@/infra/db/orm/prisma'
import app from '@/main/config/app'
import { AddServiceHourModel } from '@/domain/usecases/add-service-hour'
import { AddCompanyModel } from '@/domain/usecases/add-company'

const makeFakeServiceHourData = (companyId: string): AddServiceHourModel => ({
  companyId,
  startTime: '09:00',
  endTime: '12:00',
  weekday: 0
})

const makeFakeCompanyData = (): AddCompanyModel => ({
  name: 'verona',
  reservationPrice: 60,
  reservationTimeInMinutes: 60
})

describe('ServiceHour Routes', () => {
  afterAll(async () => {
    const deleteCompanies = db.companies.deleteMany()
    const deleteServiceHours = db.serviceHours.deleteMany()
    await db.$transaction([
      deleteServiceHours,
      deleteCompanies
    ])
    await db.$disconnect()
  })

  afterEach(async () => {
    const deleteCompanies = db.companies.deleteMany()
    const deleteServiceHours = db.serviceHours.deleteMany()
    await db.$transaction([
      deleteServiceHours,
      deleteCompanies
    ])
  })

  describe('POST /service-hour', () => {
    it('should return 200 on POST /service-hour', async () => {
      const company = await db.companies.create({
        data: makeFakeCompanyData()
      })

      await request(app)
        .post('/api/service-hour')
        .send(makeFakeServiceHourData(company.id))
        .expect(200)
    })
    it('should return 200 on GET /service-hour', async () => {
      await request(app)
        .get('/api/service-hour')
        .expect(200)
    })
  })
})
