import { RoleEnum } from '@/domain/enums/role-enum'
import { AccountModel } from '@/domain/models/account'
import { Role } from '@/domain/models/role'
import { IAuthorize } from '@/domain/usecases/authorize'
import { ServerError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/httpHelper'
import { AuthorizeMiddleware } from './authorize-middleware'

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  hashedPassword: 'hashed_password',
  role: RoleEnum.EMPLOYEE,
  companyId: null,
  company: null,
  emailValidationToken: null,
  emailValidationTokenExpiration: null,
  isConfirmed: false,
  createdAt: new Date(),
  updatedAt: new Date(),
})

const defaultPayload = false

const makeAuthorize = (): IAuthorize => {
  class AuthorizeStub implements IAuthorize {
    async authorize(): Promise<boolean> {
      return await new Promise(resolve => {
        resolve(defaultPayload)
      })
    }
  }

  return new AuthorizeStub()
}

const makeSut = (
  authorizedRoles: Role[]
): {
  authorize: IAuthorize
  authorizeMiddleware: AuthorizeMiddleware
} => {
  const authorize = makeAuthorize()
  const authorizeMiddleware = new AuthorizeMiddleware(authorizedRoles, authorize)

  return {
    authorize,
    authorizeMiddleware,
  }
}

describe('Authorize Middleware', () => {
  it('should return forbidden if user id is not present in the httpRequest', async () => {
    const { authorizeMiddleware } = makeSut([RoleEnum.EMPLOYEE])

    const httpResponse = await authorizeMiddleware.handle({})

    expect(httpResponse).toEqual(forbidden())
  })

  it('should return forbidden if Authorize returns false', async () => {
    const { authorizeMiddleware, authorize } = makeSut([RoleEnum.EMPLOYEE])

    jest.spyOn(authorize, 'authorize').mockResolvedValueOnce(false)

    const httpResponse = await authorizeMiddleware.handle({ user: makeFakeAccount() })

    expect(httpResponse).toEqual(forbidden())
  })

  it('should return serverError if Authorize throws an error', async () => {
    const { authorizeMiddleware, authorize } = makeSut([RoleEnum.EMPLOYEE])

    jest.spyOn(authorize, 'authorize').mockRejectedValueOnce(new Error('Erro'))

    const httpResponse = await authorizeMiddleware.handle({ user: makeFakeAccount() })

    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  it('should authorize the user', async () => {
    const { authorizeMiddleware, authorize } = makeSut([RoleEnum.EMPLOYEE])

    jest.spyOn(authorize, 'authorize').mockResolvedValueOnce(true)

    const httpResponse = await authorizeMiddleware.handle({ user: makeFakeAccount() })

    expect(httpResponse).toEqual(ok(true))
  })
})
