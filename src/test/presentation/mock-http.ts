import { RoleEnum } from '@/domain/enums/role-enum'
import { serverError } from '@/presentation/helpers/http/httpHelper'
import { HttpRequest, HttpResponse } from '@/presentation/protocols'

export const mockRequest = (requestValues?: Partial<HttpRequest>): HttpRequest => {
  return {
    body: {
      name: 'any_name',
      email: 'any_email@mail.com',
      companyId: 'any_company_id',
      password: 'any_password',
      passwordConfirmation: 'any_password',
      role: RoleEnum.EMPLOYEE,
    },
    ...requestValues,
  }
}

export const mockServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}
