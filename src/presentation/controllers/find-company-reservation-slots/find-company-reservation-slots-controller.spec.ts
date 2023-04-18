import { IFindReservationSlots } from '@/domain/usecases/find-reservation-slots'
import { badRequest, ok, serverError } from '@/presentation/helpers/http/httpHelper'
import { mockFindReservationSlots } from '@/test/data/db/mock-find-reservation-slots'
import { mockAccount } from '@/test/domain/models/mock-account'
import { mockRequest } from '@/test/presentation/mock-http'
import { mockValidation } from '@/test/validation/mock-validation'
import { Controller, Validation } from '../add-company/add-company-controller.protocols'
import { FindCompanyReservationSlotsController } from './find-company-reservation-slots-controller'

const fakeRequest = mockRequest({ query: { date: new Date(), user: mockAccount() } })

type SutTypes = {
  sut: Controller
  findReservationSlotsStub: IFindReservationSlots
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const findReservationSlotsStub = mockFindReservationSlots()
  const validationStub = mockValidation()
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
    jest.spyOn(findReservationSlotsStub, 'find').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('should return a bad request if FindReservationSlotsController returns an Error', async () => {
    const { sut, findReservationSlotsStub } = makeSut()
    jest.spyOn(findReservationSlotsStub, 'find').mockResolvedValueOnce(new Error('any_error'))
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
