import { ICreateCourts } from '@/domain/usecases/create-courts'
import { Validation } from '@/presentation/controllers/signup/signup-controller.protocols'
import { MissingParamError } from '@/presentation/errors'
import { badRequest, ok, serverError } from '@/presentation/helpers/http/httpHelper'
import { mockAccount } from '@/test/domain/models/mock-account'
import { mockCreateCourts } from '@/test/domain/usecases/mock-create-courts'
import { mockRequest } from '@/test/presentation/mock-http'
import { mockValidation } from '@/test/validation/mock-validation'
import { CreateCourtsController } from './create-courts-controller'

type SutTypes = {
  sut: CreateCourtsController
  validationStub: Validation
  createCourtsStub: ICreateCourts
}

const makeSut = (): SutTypes => {
  const validationStub = mockValidation()
  const createCourtsStub = mockCreateCourts()
  const sut = new CreateCourtsController(createCourtsStub, validationStub)

  return {
    sut,
    validationStub,
    createCourtsStub,
  }
}

describe('CreateCourtsController', () => {
  it('should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  it('should returns 500 if CreateCourts throws', async () => {
    const { sut, createCourtsStub } = makeSut()
    jest.spyOn(createCourtsStub, 'create').mockRejectedValueOnce(new Error())
    const httpRequest = mockRequest({ user: mockAccount(), body: { courts: [{ name: 'Quadra 1' }] } })
    const response = await sut.handle(httpRequest)

    expect(response).toEqual(serverError(new Error()))
  })

  it('should return 200 on success', async () => {
    const { sut, createCourtsStub } = makeSut()
    const httpRequest = mockRequest({ user: mockAccount(), body: { courts: [{ name: 'Quadra 1' }] } })
    const createCourtsSpy = jest.spyOn(createCourtsStub, 'create').mockResolvedValueOnce(httpRequest.body.courts.length)
    const response = await sut.handle(httpRequest)

    expect(createCourtsSpy).toHaveBeenCalledWith(httpRequest.user?.companyId, httpRequest.body.courts)
    expect(response).toEqual(ok({ courtsCount: httpRequest.body.courts.length }))
  })
})
