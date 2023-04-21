import {
  AccountModel,
  AddAccountRepository,
  LoadAccountByEmailRepository,
} from '@/data/usecases/add-account/db-add-account.protocols'
import { LoadAccountByIdRepository } from '@/data/usecases/authenticate/authenticate.protocols'
import { UpdateAccountRepository } from '@/data/usecases/update-account/update-account.protocols'
import { mockAccount } from '../../domain/models/mock-account'

export const mockAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(): Promise<AccountModel> {
      return await Promise.resolve(mockAccount())
    }
  }

  return new AddAccountRepositoryStub()
}

export const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail(): Promise<AccountModel | null> {
      return await Promise.resolve(mockAccount())
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

export const mockLoadAccountByEmailReturnNullRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail(): Promise<AccountModel | null> {
      return await Promise.resolve(null)
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

export const mockLoadAccountByIdRepository = (): LoadAccountByIdRepository => {
  class LoadAccountByIdRepositoryStub implements LoadAccountByIdRepository {
    async loadById(): Promise<AccountModel | null> {
      return mockAccount()
    }
  }

  return new LoadAccountByIdRepositoryStub()
}

export const mockUpdateAccountRepository = (): UpdateAccountRepository => {
  class UpdateAccountRepositoryStub implements UpdateAccountRepository {
    async update(): Promise<AccountModel> {
      return mockAccount({ hashedPassword: 'any_hashed_password' })
    }
  }

  return new UpdateAccountRepositoryStub()
}
