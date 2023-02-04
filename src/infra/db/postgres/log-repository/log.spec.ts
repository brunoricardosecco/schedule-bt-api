import { db } from '../../orm/prisma'
import { LogPostgresRepository } from './log'

const makeSut = (): LogPostgresRepository => {
  return new LogPostgresRepository()
}

describe('Log Postgres Repository', () => {
  afterAll(async () => {
    const deleteAccounts = db.errors.deleteMany()
    await db.$transaction([
      deleteAccounts
    ])
    await db.$disconnect()
  })

  afterEach(async () => {
    const deleteAccounts = db.errors.deleteMany()
    await db.$transaction([
      deleteAccounts
    ])
  })

  it('should create an error log on success', async () => {
    const sut = makeSut()
    await sut.logError('any_error')

    const count = await db.errors.count()

    expect(count).toBe(1)
  })
})