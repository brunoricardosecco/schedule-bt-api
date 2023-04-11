import { FindServiceHoursRepository } from '../find-service-hours/find-service-hours.protocols'
import { DeleteServiceHourRepository, IDeleteServiceHour, ServiceHour } from './delete-service-hour.protocols'

export class DeleteServiceHour implements IDeleteServiceHour {
  constructor(
    private readonly deleteServiceHourRepository: DeleteServiceHourRepository,
    private readonly findServiceHourRepository: FindServiceHoursRepository
  ) {}

  async delete({
    serviceHourId,
    companyId,
  }: {
    serviceHourId: string
    companyId: string
  }): Promise<ServiceHour | Error> {
    const serviceHours = await this.findServiceHourRepository.findBy({
      companyId,
    })

    const found = serviceHours.find(serviceHour => serviceHour.id === serviceHourId)

    if (!found) {
      return new Error('Horário de trabalho não encontrado')
    }

    return await this.deleteServiceHourRepository.delete(serviceHourId)
  }
}
