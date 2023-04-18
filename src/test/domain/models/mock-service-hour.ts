import { AddServiceHourRepositoryModel } from '@/data/usecases/add-service-hour/add-service-hour.protocols'
import { ServiceHour } from '@/domain/models/service-hour'

export const mockServiceHour = (serviceHourValues?: Partial<ServiceHour>): ServiceHour => ({
  id: 'any_id',
  companyId: 'any_company_id',
  startTime: '09:00',
  endTime: '12:00',
  weekday: 0,
  ...serviceHourValues,
})

export const mockServiceHourData = (
  serviceHourDataValues?: Partial<AddServiceHourRepositoryModel>
): AddServiceHourRepositoryModel => ({
  weekday: 0,
  startTime: '09:00',
  endTime: '12:00',
  companyId: 'any_company_id',
  ...serviceHourDataValues,
})
