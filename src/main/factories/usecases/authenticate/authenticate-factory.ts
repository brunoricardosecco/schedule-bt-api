import { IAuthenticate } from '@/domain/usecases/authenticate'
import { JWTAdapter } from '@/infra/criptography/jwt-adapter/jwt-adapter'
import { Authenticate } from '@/data/usecases/authenticate/authenticate'

export const makeAuthenticate = (): IAuthenticate => {
  const secret = process.env.SECRET ?? 'secret'
  const decrypter = new JWTAdapter(secret)

  return new Authenticate(decrypter)
}
