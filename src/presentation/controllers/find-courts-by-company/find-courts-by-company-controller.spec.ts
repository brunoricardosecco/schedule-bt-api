import { IFindCourts } from '@/domain/usecases/find-courts'
import { ok, serverError } from '@/presentation/helpers/http/httpHelper'
import { mockAccount } from '@/test/domain/models/mock-account'
import { mockCourt } from '@/test/domain/models/mock-court'
import { mockFindCourts } from '@/test/domain/usecases/mock-find-courts'
import { mockRequest } from '@/test/presentation/mock-http'
import { FindCourtsByCompanyController } from './find-courts-by-company-controller'

const fakeRequest = mockRequest({ user: mockAccount() })

type SutTypes = {
  sut: FindCourtsByCompanyController
  findManyCourtsStub: IFindCourts
}

const makeSut = (): SutTypes => {
  const findManyCourtsStub = mockFindCourts()
  const sut = new FindCourtsByCompanyController(findManyCourtsStub)

  return {
    sut,
    findManyCourtsStub,
  }
}

describe('FindCourtsController', () => {
  it('should returns 500 if FindCourts throws', async () => {
    const { sut, findManyCourtsStub } = makeSut()
    jest.spyOn(findManyCourtsStub, 'findMany').mockRejectedValueOnce(new Error())
    const response = await sut.handle(fakeRequest)

    expect(response).toEqual(serverError(new Error()))
  })

  it('should return 200 on success', async () => {
    const { sut, findManyCourtsStub } = makeSut()
    const courts = [mockCourt(), mockCourt()]
    const findManyCourtsSpy = jest.spyOn(findManyCourtsStub, 'findMany').mockResolvedValueOnce(courts)
    const response = await sut.handle(fakeRequest)

    expect(findManyCourtsSpy).toHaveBeenCalledWith({ companyId: fakeRequest.user?.companyId })
    expect(response).toStrictEqual(ok({ courts }))
  })
})
