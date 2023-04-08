import { LogErrorRepository } from '@/data/protocols/db/log/log-controller-repository'
import { db } from '@/infra/db/orm/prisma'

export class LogPostgresRepository implements LogErrorRepository {
  async logError(stack: string): Promise<void> {
    await db.errors.create({
      data: {
        stack,
      },
    })
  }
}
