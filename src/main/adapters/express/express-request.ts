import { Request } from 'express'
import { AccountModel } from '@/domain/models/account'

export interface ExpressRequest extends Request {
  user?: AccountModel
}
