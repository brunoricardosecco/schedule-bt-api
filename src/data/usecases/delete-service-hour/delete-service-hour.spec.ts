import { ServiceHour, DeleteServiceHourRepository, IDeleteServiceHour } from './delete-service-hour.protocols'
import { DeleteServiceHour } from './delete-service-hour'

const makeFakeServiceHour = (): ServiceHour => ({
  id: 'valid_id',
  companyId: 'company_id',
  startTime: '09:00',
  endTime: '12:00',
  weekday: 0
})

const fakeServiceHour = makeFakeServiceHour()

const makeDeleteServiceHourRepository = (): DeleteServiceHourRepository => {
  class DeleteServiceHourRepositoryStub implements DeleteServiceHourRepository {
    async delete (serviceHourId: string): Promise<ServiceHour> {
      return await new Promise(resolve => { resolve(fakeServiceHour) })
    }
  }

  return new DeleteServiceHourRepositoryStub()
}

type SutTypes = {
  sut: IDeleteServiceHour
  deleteServiceHourRepository: DeleteServiceHourRepository
}

const makeSut = (): SutTypes => {
  const deleteServiceHourRepository = makeDeleteServiceHourRepository()
  const sut = new DeleteServiceHour(deleteServiceHourRepository)

  return {
    deleteServiceHourRepository,
    sut
  }
}

describe('DbDeleteServiceHour', () => {
  it('should return the deleted service hour on success', async () => {
    const { deleteServiceHourRepository, sut } = makeSut()
    const deleteSpy = jest.spyOn(deleteServiceHourRepository, 'delete')
    const serviceHourId = 'any_id'

    const serviceHour = await sut.delete(serviceHourId)

    expect(deleteSpy).toHaveBeenCalledWith(serviceHourId)
    expect(serviceHour).toEqual(fakeServiceHour)
  })
})
