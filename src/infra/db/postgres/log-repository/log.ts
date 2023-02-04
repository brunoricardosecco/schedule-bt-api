import { LogErrorRepository } from '../../../../data/protocols/log-controller-repository'
import { db } from '../../orm/prisma'

export class LogPostgresRepository implements LogErrorRepository {
  async logError (stack: string): Promise<void> {
    await db.errors.create({
      data: {
        stack
      }
    })
  }
}
