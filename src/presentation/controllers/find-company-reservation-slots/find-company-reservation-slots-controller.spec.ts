import { RoleEnum } from '@/domain/enums/role-enum'
import { ReservationSlot } from '@/domain/models/reservation-slot'
import { FindReservationSlotsParams, IFindReservationSlots } from '@/domain/usecases/find-reservation-slots'
import { badRequest, ok, serverError } from '@/presentation/helpers/http/httpHelper'
import { Controller, HttpRequest, Validation } from '../add-company/add-company-controller.protocols'
import { FindCompanyReservationSlotsController } from './find-company-reservation-slots-controller'

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {},
    query: {
      date: new Date(),
    },
    user: {
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
    },
  }
}
const fakeRequest = makeFakeRequest()

const makeFindReservationSlots = (): IFindReservationSlots => {
  class FindReservationSlotsStub implements IFindReservationSlots {
    async find({ date, companyId }: FindReservationSlotsParams): Promise<ReservationSlot[] | Error> {
      return await new Promise(resolve => {
        resolve([])
      })
    }
  }

  return new FindReservationSlotsStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error | null {
      return null
    }
  }

  return new ValidationStub()
}

type SutTypes = {
  sut: Controller
  findReservationSlotsStub: IFindReservationSlots
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const findReservationSlotsStub = makeFindReservationSlots()
  const validationStub = makeValidation()
  const sut = new FindCompanyReservationSlotsController(validationStub, findReservationSlotsStub)

  return {
    sut,
    findReservationSlotsStub,
    validationStub,
  }
}

describe('FindReservationSlots Controller', () => {
  it('should return ok on success', async () => {
    const { sut, findReservationSlotsStub, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const findBySpy = jest.spyOn(findReservationSlotsStub, 'find')

    const httpResponse = await sut.handle(fakeRequest)

    expect(validateSpy).toHaveBeenCalledWith(fakeRequest.query)
    expect(findBySpy).toHaveBeenCalledWith({ date: fakeRequest.query.date, companyId: fakeRequest.user?.companyId })
    expect(httpResponse).toEqual(ok({ slots: [] }))
  })
  it('should return a server error if FindReservationSlotsController throws', async () => {
    const { sut, findReservationSlotsStub } = makeSut()

    jest.spyOn(findReservationSlotsStub, 'find').mockImplementationOnce(
      async () =>
        await new Promise((resolve, reject) => {
          reject(new Error())
        })
    )

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  })
  it('should return a bad request if FindReservationSlotsController returns an Error', async () => {
    const { sut, findReservationSlotsStub } = makeSut()

    jest.spyOn(findReservationSlotsStub, 'find').mockImplementationOnce(
      async () =>
        await new Promise(resolve => {
          resolve(new Error('any_error'))
        })
    )

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(badRequest(new Error('any_error')))
  })
  it('should return a bad request if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error('some_error'))

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(badRequest(new Error('some_error')))
  })
  it('should return a server error if Validation throws', async () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
