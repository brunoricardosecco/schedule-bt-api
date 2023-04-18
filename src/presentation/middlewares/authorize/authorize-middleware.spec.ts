import { RoleEnum } from '@/domain/enums/role-enum'
import { Role } from '@/domain/models/role'
import { IAuthorize } from '@/domain/usecases/authorize'
import { ServerError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/httpHelper'
import { mockAccount } from '@/test/domain/models/mock-account'
import { mockAuthorize } from '@/test/domain/usecases/mock-authorize'
import { AuthorizeMiddleware } from './authorize-middleware'

const makeSut = (
  authorizedRoles: Role[]
): {
  authorize: IAuthorize
  authorizeMiddleware: AuthorizeMiddleware
} => {
  const authorize = mockAuthorize()
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
    const httpResponse = await authorizeMiddleware.handle({ user: mockAccount() })

    expect(httpResponse).toEqual(forbidden())
  })

  it('should return serverError if Authorize throws an error', async () => {
    const { authorizeMiddleware, authorize } = makeSut([RoleEnum.EMPLOYEE])
    jest.spyOn(authorize, 'authorize').mockRejectedValueOnce(new Error('Erro'))
    const httpResponse = await authorizeMiddleware.handle({ user: mockAccount() })

    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  it('should authorize the user', async () => {
    const { authorizeMiddleware, authorize } = makeSut([RoleEnum.EMPLOYEE])
    jest.spyOn(authorize, 'authorize').mockResolvedValueOnce(true)
    const httpResponse = await authorizeMiddleware.handle({ user: mockAccount() })

    expect(httpResponse).toEqual(ok(true))
  })
})
