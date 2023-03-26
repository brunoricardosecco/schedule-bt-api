import request from 'supertest'
import { db } from '@/infra/db/orm/prisma'
import app from '@/main/config/app'
import { AddCompanyModel } from '@/domain/usecases/add-company'

jest.mock('jsonwebtoken', () => ({
  ...jest.requireActual('jsonwebtoken'),
  verify: jest.fn().mockReturnValue({ foo: 'bar' })
}))

const makeFakeCompanyData = (): AddCompanyModel => ({
  name: 'verona',
  reservationPrice: 60,
  reservationTimeInMinutes: 60
})

describe('Company Routes', () => {
  afterAll(async () => {
    const deleteCompanies = db.companies.deleteMany()
    await db.$transaction([
      deleteCompanies
    ])
    await db.$disconnect()
  })

  afterEach(async () => {
    const deleteCompanies = db.companies.deleteMany()
    await db.$transaction([
      deleteCompanies
    ])
  })

  describe('POST /company', () => {
    it('should return 200 on POST /company', async () => {
      await request(app)
        .post('/api/company')
        .send(makeFakeCompanyData())
        .expect(200)
    })
  })
})
