import { FindCourtsParamsToRepository, FindCourtsRepository } from '@/data/protocols/db/court/find-courts-repository'
import { CreateCourtsRepository, CreateCourtModelToRepository } from '@/data/protocols/db/court/create-courts-repository'
import { db } from '@/infra/db/orm/prisma'
import { Court } from '@/domain/models/court'

export class CourtPostgresRepository implements CreateCourtsRepository, FindCourtsRepository {
  async createMany (courts: CreateCourtModelToRepository[]): Promise<number> {
    const createdCourts = await db.courts.createMany({
      data: courts
    })

    return createdCourts.count
  }

  async findMany ({ companyId }: FindCourtsParamsToRepository): Promise<Court[]> {
    const courts = await db.courts.findMany({
      where: {
        companyId
      }
    })

    return courts
  }
}
