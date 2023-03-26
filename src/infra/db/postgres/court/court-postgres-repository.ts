import { CreateCourtsRepository, CreateCourtModelToRepository } from '@/data/protocols/db/court/create-courts-repository'
import { db } from '@/infra/db/orm/prisma'

export class CourtPostgresRepository implements CreateCourtsRepository {
  async createMany (courts: CreateCourtModelToRepository[]): Promise<number> {
    const createdCourts = await db.courts.createMany({
      data: courts
    })

    return createdCourts.count
  }
}
