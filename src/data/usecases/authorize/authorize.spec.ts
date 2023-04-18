import { mockAccount } from '@/test/domain/models/mock-account'
import { Authorize } from './authorize'
import { RoleEnum } from './authorize.protocols'

type SutTypes = {
  sut: Authorize
}

const makeSut = (): SutTypes => {
  const sut = new Authorize()

  return { sut }
}

describe('Authorize Usecase', () => {
  it('should not authorize the user', async () => {
    const { sut } = makeSut()
    const authorizedRoles = [RoleEnum.EMPLOYEE]
    const response = await sut.authorize(mockAccount({ role: RoleEnum.CLIENT }), authorizedRoles)

    expect(response).toBe(false)
  })

  it('should authorize the user', async () => {
    const { sut } = makeSut()
    const authorizedRoles = [RoleEnum.EMPLOYEE]
    const response = await sut.authorize(mockAccount({ role: RoleEnum.EMPLOYEE }), authorizedRoles)

    expect(response).toBe(true)
  })

  it('should authorize the user if the user is General Admin', async () => {
    const { sut } = makeSut()
    const authorizedRoles = [RoleEnum.EMPLOYEE]
    const response = await sut.authorize(mockAccount({ role: RoleEnum.GENERAL_ADMIN }), authorizedRoles)

    expect(response).toBe(true)
  })
})
