
import { badRequest, notFound, ok, serverError } from '@/presentation/helpers/http/httpHelper'
import MockDate from 'mockdate'
import { UpdateCourtByIdController } from './update-court-by-id-controller'
import { AccountModel, Court, HttpRequest, IUpdateCourtById, MissingParamError, NotFoundError, RoleEnum, Validation } from './update-court-by-id.protocols'

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  hashedPassword: 'hashed_password',
  role: RoleEnum.COMPANY_ADMIN,
  companyId: 'any_company_id',
  company: null,
  emailValidationToken: null,
  emailValidationTokenExpiration: null,
  isConfirmed: false,
  createdAt: new Date(),
  updatedAt: new Date()
})

const mockCourt = (): Court => ({
  id: 'any_id',
  companyId: 'any_id',
  name: 'any_name',
  createdAt: new Date(),
  updatedAt: new Date()
})

const makeFakeRequest = (courtId?: string): HttpRequest => {
  return ({
    user: makeFakeAccount(),
    params: { courtId },
    body: {
      name: 'any_name'
    }
  })
}

const makeUpdateCourtById = (): IUpdateCourtById => {
  class UpdateCourtByIdStub implements IUpdateCourtById {
    async updateById (): Promise<Court> {
      const fakeCourt = mockCourt()
      return await Promise.resolve(fakeCourt)
    }
  }

  return new UpdateCourtByIdStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (): Error | null {
      return null
    }
  }

  return new ValidationStub()
}

type SutTypes = {
  sut: UpdateCourtByIdController
  updateCourtByIdStub: IUpdateCourtById
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const updateCourtByIdStub = makeUpdateCourtById()
  const validationStub = makeValidation()
  const sut = new UpdateCourtByIdController(updateCourtByIdStub, validationStub)

  return {
    sut,
    updateCourtByIdStub,
    validationStub
  }
}

describe('UpdateeCourtByIdController', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  it('should returns 500 if UpdateCourtById throws', async () => {
    const { sut, updateCourtByIdStub } = makeSut()
    jest.spyOn(updateCourtByIdStub, 'updateById').mockRejectedValueOnce(new Error())
    const httpRequest = makeFakeRequest()
    const response = await sut.handle(httpRequest)

    expect(response).toEqual(serverError(new Error()))
  })

  it('should call UpdateCourtById with correct values', async () => {
    const { sut, updateCourtByIdStub } = makeSut()
    const updateByIdSpy = jest.spyOn(updateCourtByIdStub, 'updateById')
    const httpRequest = makeFakeRequest('any_court_id')
    await sut.handle(httpRequest)

    expect(updateByIdSpy).toHaveBeenCalledWith({
      id: 'any_court_id',
      companyId: 'any_company_id',
      data: { name: 'any_name' }
    })
  })

  it('should return 404 if court_id not exists', async () => {
    const { sut, updateCourtByIdStub } = makeSut()
    const httpRequest = makeFakeRequest()
    jest.spyOn(updateCourtByIdStub, 'updateById').mockReturnValueOnce(Promise.resolve(new NotFoundError('Quadra não encontrada')))
    const response = await sut.handle(httpRequest)

    expect(response).toStrictEqual(notFound('Quadra não encontrada'))
  })

  it('should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    const response = await sut.handle(httpRequest)

    expect(response).toStrictEqual(ok({
      companyId: 'any_id',
      createdAt: new Date(),
      id: 'any_id',
      name: 'any_name',
      updatedAt: new Date()
    }))
  })
})
