import { LogPostgresRepository } from '../../../infra/db/postgres/log/log-postgres-repository'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'

export const makeLogControllerDecorator = (controller: Controller): LogControllerDecorator => {
  const logPostgresRepository = new LogPostgresRepository()

  return new LogControllerDecorator(controller, logPostgresRepository)
}
