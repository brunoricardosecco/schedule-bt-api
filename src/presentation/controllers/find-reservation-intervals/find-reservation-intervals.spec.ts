import { ReservationInterval } from '@/domain/models/reservation-interval'
import { FindReservationIntervalsParams, IFindReservationIntervals } from '@/domain/usecases/find-reservation-intervals'
import { Controller, HttpRequest, Validation } from '../add-company/add-company-controller.protocols'
import { RoleEnum } from '@/domain/enums/role-enum'
import { badRequest, ok, serverError } from '@/presentation/helpers/http/httpHelper'
import { FindReservationIntervalsController } from './find-reservation-intervals'

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {},
    query: {
      date: new Date()
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
      updatedAt: new Date()
    }
  }
}
const fakeRequest = makeFakeRequest()

const makeFindReservationIntervals = (): IFindReservationIntervals => {
  class FindReservationIntervalsStub implements IFindReservationIntervals {
    async find ({ date, companyId }: FindReservationIntervalsParams): Promise<ReservationInterval[] | Error> {
      return await new Promise(resolve => { resolve([]) })
    }
  }

  return new FindReservationIntervalsStub()
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
  sut: Controller
  findReservationIntervalsStub: IFindReservationIntervals
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const findReservationIntervalsStub = makeFindReservationIntervals()
  const validationStub = makeValidation()
  const sut = new FindReservationIntervalsController(validationStub, findReservationIntervalsStub)

  return {
    sut,
    findReservationIntervalsStub,
    validationStub
  }
}

describe('FindReservationIntervals Controller', () => {
  it('should return 200 on success', async () => {
    const { sut, findReservationIntervalsStub, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const findBySpy = jest.spyOn(findReservationIntervalsStub, 'find')

    const httpResponse = await sut.handle(fakeRequest)

    expect(validateSpy).toHaveBeenCalledWith(fakeRequest.query)
    expect(findBySpy).toHaveBeenCalledWith({ date: fakeRequest.query.date, companyId: fakeRequest.user?.companyId })
    expect(httpResponse).toEqual(ok({ intervals: [] }))
  })
  it('should return 500 if FindReservationIntervalsController throws', async () => {
    const { sut, findReservationIntervalsStub } = makeSut()

    jest.spyOn(findReservationIntervalsStub, 'find').mockImplementationOnce(async () => await new Promise((resolve, reject) => { reject(new Error()) }))

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  })
  it('should returns a bad request if FindReservationIntervalsController returns an Error', async () => {
    const { sut, findReservationIntervalsStub } = makeSut()

    jest.spyOn(findReservationIntervalsStub, 'find').mockImplementationOnce(async () => await new Promise((resolve) => { resolve(new Error('any_error')) }))

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(badRequest(new Error('any_error')))
  })
  it('should returns a bad request if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error('some_error'))

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(badRequest(new Error('some_error')))
  })
})
