import { MissingParamError, ServerError } from '@/presentation/errors'
import { Company, AddCompany, AddCompanyModel, HttpRequest, Validation } from './add-company-controller.protocols'
import { AddCompanyController } from './add-company-controller'
import { badRequest, ok, serverError } from '@/presentation/helpers/http/httpHelper'

const makeFakeCompany = (): Company => ({
  id: 'valid_id',
  name: 'any_name',
  reservationPrice: '60.00',
  reservationTimeInMinutes: 80,
  createdAt: new Date(),
  updatedAt: new Date()
})

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      name: 'any_name',
      reservationPrice: '60.00',
      reservationTimeInMinutes: 80
    }
  }
}

const makeAddCompany = (): AddCompany => {
  class AddCompanyStub implements AddCompany {
    async add (account: AddCompanyModel): Promise<Company> {
      return await new Promise(resolve => { resolve(makeFakeCompany()) })
    }
  }

  return new AddCompanyStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }

  return new ValidationStub()
}

type SutTypes = {
  sut: AddCompanyController
  addCompanyStub: AddCompany
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const addCompanyStub = makeAddCompany()
  const sut = new AddCompanyController(addCompanyStub, validationStub)

  return {
    sut,
    addCompanyStub,
    validationStub
  }
}

describe('AddCompany Controller', () => {
  it('should call AddCompany with correct values', async () => {
    const { sut, addCompanyStub } = makeSut()

    const addSpy = jest.spyOn(addCompanyStub, 'add')

    await sut.handle(makeFakeRequest())

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  it('should return 500 if AddCompany throws', async () => {
    const { sut, addCompanyStub } = makeSut()
    jest.spyOn(addCompanyStub, 'add').mockImplementationOnce(async () => { return await new Promise((resolve, reject) => { reject(new Error()) }) })

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  it('should return 200 if a valid data is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(ok({
      account: makeFakeCompany()
    }))
  })

  it('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()

    const validateSpy = jest.spyOn(validationStub, 'validate')

    const httpRequest = makeFakeRequest()

    await sut.handle(makeFakeRequest())

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
