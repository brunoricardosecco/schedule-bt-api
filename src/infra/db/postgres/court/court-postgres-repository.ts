import { CreateCourtModelToRepository, CreateCourtsRepository } from '@/data/protocols/db/court/create-courts-repository'
import { DeleteCourtByIdRepository } from '@/data/protocols/db/court/delete-court-by-id-repository'
import { FindCourtByIdAndCompanyIdRepository } from '@/data/protocols/db/court/find-court-by-id-and-company-id.repository'
import { FindCourtsParamsToRepository, FindCourtsRepository } from '@/data/protocols/db/court/find-courts-repository'
import { Court } from '@/domain/models/court'
import { db } from '@/infra/db/orm/prisma'

export class CourtPostgresRepository implements CreateCourtsRepository, FindCourtsRepository, FindCourtByIdAndCompanyIdRepository, DeleteCourtByIdRepository {
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

  async findByIdAndCompanyId (courtId: string, companyId: string): Promise<Court | null> {
    const court = await db.courts.findFirst({
      where: {
        id: courtId,
        companyId
      }
    })

    return court
  }

  async deleteById (courtId: string): Promise<Court> {
    const court = await db.courts.update({
      where: {
        id: courtId
      },
      data: {
        status: 'INACTIVE'
      }
    })

    return court
  }
}
