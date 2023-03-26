import { Company } from './company'

export type Court = {
  id: string
  name: string
  companyId: string
  company?: Company | null
  createdAt: Date
  updatedAt: Date
}
