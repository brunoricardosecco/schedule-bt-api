import { LogPostgresRepository } from '@/infra/db/postgres/log/log-postgres-repository'
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator'
import { Controller } from '@/presentation/protocols'

export const makeLogControllerDecorator = (controller: Controller): LogControllerDecorator => {
  const logPostgresRepository = new LogPostgresRepository()

  return new LogControllerDecorator(controller, logPostgresRepository)
}
