import { Court } from "../models/court";

export interface IDeleteCourtById {
  deleteById: (courtId: string) => Promise<Court>
}
