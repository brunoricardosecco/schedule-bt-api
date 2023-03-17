import { unauthorized, serverError, ok } from '@/presentation/helpers/http/httpHelper'
import { RoleEnum } from '@/domain/enums/role-enum'
import { Role } from '@/domain/models/role'
import { IAuthorize } from '@/domain/usecases/authorize'
import { ServerError } from '@/presentation/errors'
import { AuthorizeMiddleware } from './authorize-middleware'

const defaultPayload = false

const makeAuthorize = (): IAuthorize => {
  class AuthorizeStub implements IAuthorize {
    async authorize (): Promise<boolean | Error> {
      return await new Promise(resolve => { resolve(defaultPayload) })
    }
  }

  return new AuthorizeStub()
}

const makeSut = (authorizedRoles: Role[]): {
  authorize: IAuthorize
  authorizeMiddleware: AuthorizeMiddleware
} => {
  const authorize = makeAuthorize()
  const authorizeMiddleware = new AuthorizeMiddleware(authorizedRoles, authorize)

  return {
    authorize,
    authorizeMiddleware
  }
}

describe('Authorize Middleware', () => {
  it('should return 401 if user id is not present in the httpRequest', async () => {
    const { authorizeMiddleware } = makeSut([RoleEnum.EMPLOYEE])

    const httpResponse = await authorizeMiddleware.handle({})

    expect(httpResponse).toEqual(unauthorized())
  })

  it('should return 401 if Authorize returns an error', async () => {
    const { authorizeMiddleware, authorize } = makeSut([RoleEnum.EMPLOYEE])

    jest.spyOn(authorize, 'authorize').mockReturnValueOnce(new Promise((resolve) => { resolve(new Error('Erro')) }))

    const httpResponse = await authorizeMiddleware.handle({ userId: 'any_id' })

    expect(httpResponse).toEqual(unauthorized())
  })

  it('should return 401 if Authorize returns false', async () => {
    const { authorizeMiddleware, authorize } = makeSut([RoleEnum.EMPLOYEE])

    jest.spyOn(authorize, 'authorize').mockReturnValueOnce(new Promise((resolve) => { resolve(false) }))

    const httpResponse = await authorizeMiddleware.handle({ userId: 'any_id' })

    expect(httpResponse).toEqual(unauthorized())
  })

  it('should return 500 if Authorize throws an error', async () => {
    const { authorizeMiddleware, authorize } = makeSut([RoleEnum.EMPLOYEE])

    jest.spyOn(authorize, 'authorize').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error('Erro')) }))

    const httpResponse = await authorizeMiddleware.handle({ userId: 'any_id' })

    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  it('should return 200', async () => {
    const { authorizeMiddleware, authorize } = makeSut([RoleEnum.EMPLOYEE])

    jest.spyOn(authorize, 'authorize').mockReturnValueOnce(new Promise((resolve) => { resolve(true) }))

    const httpResponse = await authorizeMiddleware.handle({ userId: 'any_id' })

    expect(httpResponse).toEqual(ok(true))
  })
})
