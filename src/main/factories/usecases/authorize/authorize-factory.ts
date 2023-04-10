import { Authorize } from '@/data/usecases/authorize/authorize'
import { IAuthorize } from '@/domain/usecases/authorize'

export const makeAuthorize = (): IAuthorize => {
  return new Authorize()
}
