import { Court } from '@/domain/models/court'
import { FindCourtsReturn, IFindCourts } from '@/domain/usecases/find-courts'
import { ok, serverError } from '@/presentation/helpers/http/httpHelper'
import { HttpRequest } from '@/presentation/controllers/signup/signup-controller.protocols'
import { FindCourtsByCompanyController } from './find-courts-by-company-controller'

const makeFakeCourt = (): Court => ({
  id: 'valid_id',
  name: 'any_name',
  companyId: 'company_id',
  createdAt: new Date(),
  updatedAt: new Date()
})

const makeFakeRequest = (): HttpRequest => {
  return ({
    userId: 'userId'
  })
}

const makeFindCourts = (): IFindCourts => {
  class FindCourtsStub implements IFindCourts {
    async findMany (): FindCourtsReturn {
      return await new Promise(resolve => { resolve([]) })
    }
  }

  return new FindCourtsStub()
}

type SutTypes = {
  sut: FindCourtsByCompanyController
  findManyCourtsStub: IFindCourts
}

const makeSut = (): SutTypes => {
  const findManyCourtsStub = makeFindCourts()
  const sut = new FindCourtsByCompanyController(findManyCourtsStub)

  return {
    sut,
    findManyCourtsStub
  }
}

describe('FindCourtsController', () => {
  it('should returns 500 if FindCourts throws', async () => {
    const { sut, findManyCourtsStub } = makeSut()

    jest.spyOn(findManyCourtsStub, 'findMany').mockRejectedValueOnce(new Error())

    const httpRequest = makeFakeRequest()

    const response = await sut.handle(httpRequest)

    expect(response).toEqual(serverError(new Error()))
  })

  it('should return 200 on success', async () => {
    const { sut, findManyCourtsStub } = makeSut()

    const httpRequest = makeFakeRequest()
    const courts = [makeFakeCourt(), makeFakeCourt()]
    const findManyCourtsSpy = jest.spyOn(findManyCourtsStub, 'findMany')
    findManyCourtsSpy.mockResolvedValueOnce(courts)

    const response = await sut.handle(httpRequest)

    expect(findManyCourtsSpy).toHaveBeenCalledWith({ userId: httpRequest.userId })
    expect(response).toStrictEqual(
      ok({
        courts
      })
    )
  })
})
