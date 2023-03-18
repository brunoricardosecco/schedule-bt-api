import { CreateCourtsRepository } from '@/data/protocols/db/court/create-courts-repository'
import { CreateCourtModel } from '@/domain/usecases/create-courts'
import { db } from '@/infra/db/orm/prisma'

export class CourtPostgresRepository implements CreateCourtsRepository {
  async createMany (courts: CreateCourtModel[]): Promise<number> {
    const createdCourts = await db.courts.createMany({
      data: courts
    })

    return createdCourts.count
  }
}
