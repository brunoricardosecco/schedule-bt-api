import request from 'supertest'
import { db } from '@/infra/db/orm/prisma'
import app from '@/main/config/app'
import { AddCompanyModel } from '@/domain/usecases/add-company'

const makeFakeCompanyData = (): AddCompanyModel => ({
  name: 'verona',
  reservationPrice: 60,
  reservationTimeInMinutes: 60
})

describe('Company Routes', () => {
  afterEach(async () => {
    await db.$executeRawUnsafe('TRUNCATE TABLE "Companies" CASCADE;')
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
