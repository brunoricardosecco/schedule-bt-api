import { IAuthorize } from '@/domain/usecases/authorize'
import { Authorize } from '@/data/usecases/authorize/authorize'

export const makeAuthorize = (): IAuthorize => {
  return new Authorize()
}
