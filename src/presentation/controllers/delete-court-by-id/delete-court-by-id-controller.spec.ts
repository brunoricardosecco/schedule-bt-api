import { HttpRequest } from '@/presentation/controllers/signup/signup-controller.protocols'
import { noContent, notFound, serverError } from '@/presentation/helpers/http/httpHelper'
import { DeleteCourtByIdController } from './delete-court-by-id-controller'
import { AccountModel, Court, IDeleteCourtById, NotFoundError, RoleEnum } from './delete-court-by-id.protocols'

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  hashedPassword: 'hashed_password',
  role: RoleEnum.COMPANY_ADMIN,
  companyId: 'any_company_id',
  company: null,
  emailValidationToken: null,
  emailValidationTokenExpiration: null,
  isConfirmed: false,
  createdAt: new Date(),
  updatedAt: new Date(),
})

const mockCourt = (): Court => ({
  id: 'any_id',
  companyId: 'any_id',
  name: 'any_name',
  createdAt: new Date(),
  updatedAt: new Date(),
})

const makeFakeRequest = (courtId?: string): HttpRequest => {
  return {
    user: makeFakeAccount(),
    params: { courtId },
  }
}

const makeDeleteCourtById = (): IDeleteCourtById => {
  class DeleteCourtByIdStub implements IDeleteCourtById {
    async deleteById(courtId: string): Promise<Court> {
      const fakeCourt = mockCourt()
      return await Promise.resolve(fakeCourt)
    }
  }

  return new DeleteCourtByIdStub()
}

type SutTypes = {
  sut: DeleteCourtByIdController
  deleteCourtByIdStub: IDeleteCourtById
}

const makeSut = (): SutTypes => {
  const deleteCourtByIdStub = makeDeleteCourtById()
  const sut = new DeleteCourtByIdController(deleteCourtByIdStub)

  return {
    sut,
    deleteCourtByIdStub,
  }
}

describe('DeleteCourtByIdController', () => {
  it('should returns 500 if DeleteCourtById throws', async () => {
    const { sut, deleteCourtByIdStub } = makeSut()
    jest.spyOn(deleteCourtByIdStub, 'deleteById').mockRejectedValueOnce(new Error())
    const httpRequest = makeFakeRequest()
    const response = await sut.handle(httpRequest)

    expect(response).toEqual(serverError(new Error()))
  })

  it('should call DeleteCourtById with correct values', async () => {
    const { sut, deleteCourtByIdStub } = makeSut()
    const deleteByIdSpy = jest.spyOn(deleteCourtByIdStub, 'deleteById')
    const httpRequest = makeFakeRequest('any_court_id')
    await sut.handle(httpRequest)

    expect(deleteByIdSpy).toHaveBeenCalledWith('any_court_id', 'any_company_id')
  })

  it('should return 404 if court_id not exists', async () => {
    const { sut, deleteCourtByIdStub } = makeSut()
    const httpRequest = makeFakeRequest()
    jest
      .spyOn(deleteCourtByIdStub, 'deleteById')
      .mockReturnValueOnce(Promise.resolve(new NotFoundError('Quadra não encontrada')))
    const response = await sut.handle(httpRequest)

    expect(response).toStrictEqual(notFound('Quadra não encontrada'))
  })

  it('should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    const response = await sut.handle(httpRequest)

    expect(response).toStrictEqual(noContent())
  })
})
