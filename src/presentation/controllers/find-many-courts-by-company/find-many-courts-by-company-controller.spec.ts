import { Court } from '@/domain/models/court'
import { FindManyCourtsReturn, IFindManyCourts } from '@/domain/usecases/find-many-courts'
import { ok, serverError } from '@/presentation/helpers/http/httpHelper'
import { HttpRequest } from '@/presentation/controllers/signup/signup-controller.protocols'
import { FindManyCourtsByCompanyController } from './find-many-courts-by-company-controller'

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

const makeFindManyCourts = (): IFindManyCourts => {
  class FindManyCourtsStub implements IFindManyCourts {
    async findMany (): FindManyCourtsReturn {
      return await new Promise(resolve => { resolve([]) })
    }
  }

  return new FindManyCourtsStub()
}

type SutTypes = {
  sut: FindManyCourtsByCompanyController
  findManyCourtsStub: IFindManyCourts
}

const makeSut = (): SutTypes => {
  const findManyCourtsStub = makeFindManyCourts()
  const sut = new FindManyCourtsByCompanyController(findManyCourtsStub)

  return {
    sut,
    findManyCourtsStub
  }
}

describe('FindManyCourtsController', () => {
  it('should returns 500 if FindManyCourts throws', async () => {
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
