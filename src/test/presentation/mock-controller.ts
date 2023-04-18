import { ok } from '@/presentation/helpers/http/httpHelper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { mockAccount } from '../domain/models/mock-account'

export const mockController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return await Promise.resolve(ok(mockAccount()))
    }
  }

  return new ControllerStub()
}
