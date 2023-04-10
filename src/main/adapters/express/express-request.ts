import { AccountModel } from '@/domain/models/account'
import { Request } from 'express'

export interface ExpressRequest extends Request {
  user?: AccountModel
}
