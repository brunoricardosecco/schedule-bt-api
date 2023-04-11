import MockDate from 'mockdate'
import { MeController } from './me-controller'
import {
  AccountModel,
  Company,
  HttpRequest,
  IFindAccountById,
  ok,
  RoleEnum,
  serverError,
} from './me-controller.protocols'

const makeFakeCompany = (): Company => ({
  id: 'valid_id',
  name: 'verona',
  reservationPrice: 60,
  reservationTimeInMinutes: 60,
  createdAt: new Date(),
  updatedAt: new Date(),
})

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  hashedPassword: 'hashed_password',
  role: RoleEnum.EMPLOYEE,
  companyId: null,
  company: makeFakeCompany(),
  emailValidationToken: null,
  emailValidationTokenExpiration: null,
  isConfirmed: false,
  createdAt: new Date(),
  updatedAt: new Date(),
})

const makeFakeRequest = (): HttpRequest => {
  return {
    user: makeFakeAccount(),
  }
}

const makeFindAccountById = (): IFindAccountById => {
  class FindAccountByIdStub implements IFindAccountById {
    async findById(accountId: string): Promise<AccountModel> {
      const fakeAccount = makeFakeAccount()
      return await Promise.resolve(fakeAccount)
    }
  }

  return new FindAccountByIdStub()
}

type SutTypes = {
  sut: MeController
  findAccountByIdStub: IFindAccountById
}

const makeSut = (): SutTypes => {
  const findAccountByIdStub = makeFindAccountById()
  const sut = new MeController(findAccountByIdStub)

  return {
    findAccountByIdStub,
    sut,
  }
}

describe('Me Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should call FindAccountById with correct values', async () => {
    const { sut, findAccountByIdStub } = makeSut()
    const findByIdSpy = jest.spyOn(findAccountByIdStub, 'findById')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)

    expect(findByIdSpy).toHaveBeenCalledWith('valid_id')
  })

  it('should returns 500 if FindAccountById throws', async () => {
    const { sut, findAccountByIdStub } = makeSut()
    jest.spyOn(findAccountByIdStub, 'findById').mockRejectedValueOnce(new Error())
    const httpRequest = makeFakeRequest()
    const response = await sut.handle(httpRequest)

    expect(response).toEqual(serverError(new Error()))
  })

  it('should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })
})
