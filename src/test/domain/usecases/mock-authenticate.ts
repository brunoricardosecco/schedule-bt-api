import { IAuthenticate, IAuthenticateReturn } from '@/domain/usecases/authenticate'
import { mockAccount } from '../models/mock-account'

export const mockAuthenticate = (): IAuthenticate => {
  class AuthenticateStub implements IAuthenticate {
    async auth(): Promise<IAuthenticateReturn | Error> {
      return await Promise.resolve({ user: mockAccount() })
    }
  }

  return new AuthenticateStub()
}
