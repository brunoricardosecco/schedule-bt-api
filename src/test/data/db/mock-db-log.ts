import { LogErrorRepository } from '@/data/protocols/db/log/log-controller-repository'

export const mockLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
      await Promise.resolve(null)
    }
  }

  return new LogErrorRepositoryStub()
}
