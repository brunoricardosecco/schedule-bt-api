import { AccountModel } from '@/domain/models/account'
import { Court } from '@/domain/models/court'
import { FindCourtsReturn, IFindCourts } from '@/domain/usecases/find-courts'
import { ok, serverError } from '@/presentation/helpers/http/httpHelper'
import { HttpRequest } from '@/presentation/controllers/signup/signup-controller.protocols'
import { FindCourtsByCompanyController } from './find-courts-by-company-controller'
import { RoleEnum } from '@/domain/enums/role-enum'

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
  updatedAt: new Date()
})

const makeFakeCourt = (): Court => ({
  id: 'valid_id',
  name: 'any_name',
  companyId: 'company_id',
  createdAt: new Date(),
  updatedAt: new Date()
})

const makeFakeRequest = (): HttpRequest => {
  return ({
    user: makeFakeAccount()
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

    expect(findManyCourtsSpy).toHaveBeenCalledWith({ companyId: httpRequest.user?.companyId })
    expect(response).toStrictEqual(
      ok({
        courts
      })
    )
  })
})
