import { Court } from '@/domain/models/court'

export const mockCourt = (courtValues?: Partial<Court>): Court => ({
  id: 'any_id',
  companyId: 'any_id',
  name: 'any_name',
  createdAt: new Date('1970-01-01T00:00:00.000Z'),
  updatedAt: new Date('1970-01-01T00:00:00.000Z'),
  ...courtValues,
})
