import { IAuthenticateByPassword, TAuthenticateByPasswordParams } from '@/domain/usecases/authenticate-by-password'

export const mockAuthenticateByPasswordParams = (): TAuthenticateByPasswordParams => ({
  email: 'any_email@mail.com',
  password: 'any_password',
})

export const mockAuthenticateByPassword = (): IAuthenticateByPassword => {
  class AuthenticateStub implements IAuthenticateByPassword {
    async auth(): Promise<string> {
      return await Promise.resolve('any_token')
    }
  }

  return new AuthenticateStub()
}
