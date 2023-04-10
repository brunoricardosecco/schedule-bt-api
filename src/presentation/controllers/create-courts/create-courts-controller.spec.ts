import { RoleEnum } from '@/domain/enums/role-enum'
import { AccountModel } from '@/domain/models/account'
import { CreateCourtsReturn, ICreateCourts } from '@/domain/usecases/create-courts'
import { HttpRequest, Validation } from '@/presentation/controllers/signup/signup-controller.protocols'
import { MissingParamError } from '@/presentation/errors'
import { badRequest, ok, serverError } from '@/presentation/helpers/http/httpHelper'
import { CreateCourtsController } from './create-courts-controller'

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  hashedPassword: 'hashed_password',
  role: RoleEnum.COMPANY_ADMIN,
  companyId: 'company_id',
  company: null,
  emailValidationToken: null,
  emailValidationTokenExpiration: null,
  isConfirmed: false,
  createdAt: new Date(),
  updatedAt: new Date(),
})

const makeFakeRequest = (): HttpRequest => {
  return {
    user: makeFakeAccount(),
    body: {
      courts: [
        {
          name: 'Quadra 1',
        },
      ],
    },
  }
}

const makeCreateCourts = (): ICreateCourts => {
  class CreateCourtsStub implements ICreateCourts {
    async create(): CreateCourtsReturn {
      return await new Promise(resolve => {
        resolve(2)
      })
    }
  }

  return new CreateCourtsStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(): Error | null {
      return null
    }
  }

  return new ValidationStub()
}

type SutTypes = {
  sut: CreateCourtsController
  validationStub: Validation
  createCourtsStub: ICreateCourts
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const createCourtsStub = makeCreateCourts()
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

    const httpRequest = makeFakeRequest()

    const response = await sut.handle(httpRequest)

    expect(response).toEqual(serverError(new Error()))
  })

  it('should return 200 on success', async () => {
    const { sut, createCourtsStub } = makeSut()

    const httpRequest = makeFakeRequest()

    const createCourtsSpy = jest.spyOn(createCourtsStub, 'create')
    createCourtsSpy.mockResolvedValueOnce(httpRequest.body.courts.length)

    const response = await sut.handle(httpRequest)

    expect(createCourtsSpy).toHaveBeenCalledWith(httpRequest.user?.companyId, httpRequest.body.courts)
    expect(response).toEqual(
      ok({
        courtsCount: httpRequest.body.courts.length,
      })
    )
  })
})
