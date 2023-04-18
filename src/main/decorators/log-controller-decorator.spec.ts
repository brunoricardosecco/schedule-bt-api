import { LogErrorRepository } from '@/data/protocols/db/log/log-controller-repository'
import { ok } from '@/presentation/helpers/http/httpHelper'
import { Controller } from '@/presentation/protocols'
import { mockLogErrorRepository } from '@/test/data/db/mock-db-log'
import { mockAccount } from '@/test/domain/models/mock-account'
import { mockController } from '@/test/presentation/mock-controller'
import { mockRequest, mockServerError } from '@/test/presentation/mock-http'
import { LogControllerDecorator } from './log-controller-decorator'

type SutTypes = {
  logErrorRepositoryStub: LogErrorRepository
  controllerStub: Controller
  sut: LogControllerDecorator
}

const makeSut = (): SutTypes => {
  const controllerStub = mockController()
  const logErrorRepositoryStub = mockLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

  return {
    logErrorRepositoryStub,
    controllerStub,
    sut,
  }
}

describe('LogControllerDecorator', () => {
  it('should call controller handle', async () => {
    const { controllerStub, sut } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)

    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  it('should returns the correct values', async () => {
    const { sut } = makeSut()
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(ok(mockAccount()))
  })

  it('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    jest.spyOn(controllerStub, 'handle').mockResolvedValueOnce(mockServerError())
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    await sut.handle(mockRequest())

    expect(logSpy)
  })
})
