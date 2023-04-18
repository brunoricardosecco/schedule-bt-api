import { IAuthorize } from '@/domain/usecases/authorize'

export const mockAuthorize = (): IAuthorize => {
  class AuthorizeStub implements IAuthorize {
    async authorize(): Promise<boolean> {
      return Promise.resolve(false)
    }
  }

  return new AuthorizeStub()
}
