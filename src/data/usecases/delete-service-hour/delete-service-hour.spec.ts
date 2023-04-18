import { mockDeleteServiceHourRepository, mockFindServiceHoursRepository } from '@/test/data/db/mock-db-service-hour'
import { mockServiceHour } from '@/test/domain/models/mock-service-hour'
import { FindServiceHoursRepository } from '../find-service-hours/find-service-hours.protocols'
import { DeleteServiceHour } from './delete-service-hour'
import { DeleteServiceHourRepository, IDeleteServiceHour } from './delete-service-hour.protocols'

type SutTypes = {
  sut: IDeleteServiceHour
  deleteServiceHourRepository: DeleteServiceHourRepository
  findServiceHoursRepository: FindServiceHoursRepository
}

const makeSut = (): SutTypes => {
  const deleteServiceHourRepository = mockDeleteServiceHourRepository()
  const findServiceHoursRepository = mockFindServiceHoursRepository()
  const sut = new DeleteServiceHour(deleteServiceHourRepository, findServiceHoursRepository)

  return {
    deleteServiceHourRepository,
    findServiceHoursRepository,
    sut,
  }
}

describe('DbDeleteServiceHour', () => {
  it('should return the deleted service hour on success', async () => {
    const { deleteServiceHourRepository, sut } = makeSut()
    const deleteSpy = jest.spyOn(deleteServiceHourRepository, 'delete')
    const serviceHourId = 'any_id'
    const companyId = 'any_company_id'
    const serviceHour = await sut.delete({ serviceHourId, companyId })

    expect(deleteSpy).toHaveBeenCalledWith(serviceHourId)
    expect(serviceHour).toEqual(mockServiceHour())
  })

  it("should return an error if it doesn't find the service hour selected for deletion", async () => {
    const { findServiceHoursRepository, sut } = makeSut()
    jest.spyOn(findServiceHoursRepository, 'findBy').mockResolvedValueOnce([])
    const serviceHourId = 'any_id'
    const companyId = 'any_company_id'
    const error = await sut.delete({ serviceHourId, companyId })

    expect(error).toEqual(new Error('Horário de trabalho não encontrado'))
  })
})
