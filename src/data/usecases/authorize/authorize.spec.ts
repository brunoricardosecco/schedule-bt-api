import { Authorize } from './authorize'
import {
  AccountModel,
  RoleEnum
} from './authorize.protocols'

const makeFakeAccount = (role: RoleEnum): AccountModel => ({
  role,
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  hashedPassword: 'hashed_password',
  companyId: null,
  company: null,
  emailValidationToken: null,
  emailValidationTokenExpiration: null,
  isConfirmed: false,
  createdAt: new Date(),
  updatedAt: new Date()
})

type SutTypes = {
  sut: Authorize }

const makeSut = (): SutTypes => {
  const sut = new Authorize()

  return {
    sut
  }
}

describe('Authorize Usecase', () => {
  it('should not authorize the user', async () => {
    const { sut } = makeSut()

    const authorizedRoles = [RoleEnum.EMPLOYEE]

    const response = await sut.authorize(makeFakeAccount(RoleEnum.CLIENT), authorizedRoles)

    expect(response).toBe(false)
  })

  it('should authorize the user', async () => {
    const { sut } = makeSut()

    const authorizedRoles = [RoleEnum.EMPLOYEE]

    const response = await sut.authorize(makeFakeAccount(RoleEnum.EMPLOYEE), authorizedRoles)

    expect(response).toBe(true)
  })

  it('should authorize the user if the user is General Admin', async () => {
    const { sut } = makeSut()

    const authorizedRoles = [RoleEnum.EMPLOYEE]

    const response = await sut.authorize(makeFakeAccount(RoleEnum.GENERAL_ADMIN), authorizedRoles)

    expect(response).toBe(true)
  })
})
