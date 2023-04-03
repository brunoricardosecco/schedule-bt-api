import { Court } from '../models/court'

export interface IDeleteCourtById {
  deleteById: (courtId: string, companyId: string) => Promise<Court | Error>
}
