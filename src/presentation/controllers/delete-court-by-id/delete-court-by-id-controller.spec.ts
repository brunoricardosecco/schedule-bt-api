import { FindCourtByIdAndCompanyIdRepository } from '@/data/protocols/db/court/find-court-by-id-and-company-id.repository'
import { RoleEnum } from '@/domain/enums/role-enum'
import { AccountModel } from '@/domain/models/account'
import { Court } from '@/domain/models/court'
import { IDeleteCourtById } from '@/domain/usecases/delete-court-by-id'
import { IFindCourtByIdAndCompanyId } from '@/domain/usecases/find-court-by-id'
import { HttpRequest } from '@/presentation/controllers/signup/signup-controller.protocols'
import { noContent, notFound, serverError } from '@/presentation/helpers/http/httpHelper'
import { DeleteCourtByIdController } from './delete-court-by-id-controller'

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
  })
}

const makeDeleteCourtById = (): IDeleteCourtById => {
  class DeleteCourtByIdStub implements IDeleteCourtById {
    async deleteById (courtId: string): Promise<Court> {
      const fakeCourt = mockCourt()
      return Promise.resolve(fakeCourt)
    }
  }

  return new DeleteCourtByIdStub()
}

const makeFindCourtByIdAndCompanyIdRepository = (): FindCourtByIdAndCompanyIdRepository => {
  class FindCourtByIdAndCompanyIdRepositoryStub implements FindCourtByIdAndCompanyIdRepository {
    findByIdAndCompanyId(courtId: string, companyId: string): Promise<Court | null> {
      const fakeCourt = mockCourt()
      return Promise.resolve(fakeCourt)
    }
  }

  return new FindCourtByIdAndCompanyIdRepositoryStub()
}

type SutTypes = {
  sut: DeleteCourtByIdController
  deleteCourtByIdStub: IDeleteCourtById
  findCourtByIdAndCompanyIdStub: IFindCourtByIdAndCompanyId
}

const makeSut = (): SutTypes => {
  const deleteCourtByIdStub = makeDeleteCourtById()
  const findCourtByIdAndCompanyIdStub = makeFindCourtByIdAndCompanyIdRepository()
  const sut = new DeleteCourtByIdController(deleteCourtByIdStub, findCourtByIdAndCompanyIdStub)

  return {
    sut,
    deleteCourtByIdStub,
    findCourtByIdAndCompanyIdStub
  }
}

describe('DeleteCourtByIdController', () => {
  it('should returns 500 if FindCourtByIdAndCompanyId throws', async () => {
    const { sut, findCourtByIdAndCompanyIdStub } = makeSut()
    jest.spyOn(findCourtByIdAndCompanyIdStub, 'findByIdAndCompanyId').mockRejectedValueOnce(new Error())
    const httpRequest = makeFakeRequest()
    const response = await sut.handle(httpRequest)

    expect(response).toEqual(serverError(new Error()))
  })

  it('should returns 500 if DeleteCourtById throws', async () => {
    const { sut, deleteCourtByIdStub } = makeSut()
    jest.spyOn(deleteCourtByIdStub, 'deleteById').mockRejectedValueOnce(new Error())
    const httpRequest = makeFakeRequest()
    const response = await sut.handle(httpRequest)

    expect(response).toEqual(serverError(new Error()))
  })

  it('should call FindCourtByIdAndCompanyId with correct values', async () => {
    const { sut, findCourtByIdAndCompanyIdStub } = makeSut()
    const findByIdAndCompanyIdSpy = jest.spyOn(findCourtByIdAndCompanyIdStub, 'findByIdAndCompanyId')
    const httpRequest = makeFakeRequest('any_court_id')
    await sut.handle(httpRequest)

    expect(findByIdAndCompanyIdSpy).toHaveBeenCalledWith('any_court_id', 'company_id');
  })

  it('should call DeleteCourtById with correct values', async () => {
    const { sut, deleteCourtByIdStub } = makeSut()
    const deleteByIdSpy = jest.spyOn(deleteCourtByIdStub, 'deleteById')
    const httpRequest = makeFakeRequest('any_court_id')
    await sut.handle(httpRequest)

    expect(deleteByIdSpy).toHaveBeenCalledWith('any_court_id');
  })

  it('should return 404 if court_id not exists', async () => {
    const { sut, findCourtByIdAndCompanyIdStub } = makeSut()
    const httpRequest = makeFakeRequest()
    jest.spyOn(findCourtByIdAndCompanyIdStub, 'findByIdAndCompanyId').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.handle(httpRequest)

    expect(response).toStrictEqual(notFound())
  })

  it('should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    const response = await sut.handle(httpRequest)

    expect(response).toStrictEqual(noContent())
  })
})
