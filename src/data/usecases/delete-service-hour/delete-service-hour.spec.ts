import { ServiceHour, DeleteServiceHourRepository, IDeleteServiceHour } from './delete-service-hour.protocols'
import { DeleteServiceHour } from './delete-service-hour'
import { FindServiceHoursRepository, FindServiceHoursRepositoryParams } from '../find-service-hours/find-service-hours.protocols'

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
      return fakeServiceHour
    }
  }

  return new DeleteServiceHourRepositoryStub()
}

const makeFindServiceHoursRepository = (): FindServiceHoursRepository => {
  class FindServiceHoursRepositoryStub implements FindServiceHoursRepository {
    async findBy (params: FindServiceHoursRepositoryParams): Promise<ServiceHour[]> {
      return [fakeServiceHour]
    }
  }

  return new FindServiceHoursRepositoryStub()
}

type SutTypes = {
  sut: IDeleteServiceHour
  deleteServiceHourRepository: DeleteServiceHourRepository
  findServiceHoursRepository: FindServiceHoursRepository
}

const makeSut = (): SutTypes => {
  const deleteServiceHourRepository = makeDeleteServiceHourRepository()
  const findServiceHoursRepository = makeFindServiceHoursRepository()
  const sut = new DeleteServiceHour(deleteServiceHourRepository, findServiceHoursRepository)

  return {
    deleteServiceHourRepository,
    findServiceHoursRepository,
    sut
  }
}

describe('DbDeleteServiceHour', () => {
  it('should return the deleted service hour on success', async () => {
    const { deleteServiceHourRepository, sut } = makeSut()
    const deleteSpy = jest.spyOn(deleteServiceHourRepository, 'delete')
    const serviceHourId = 'valid_id'
    const companyId = 'any_company_id'

    const serviceHour = await sut.delete({ serviceHourId, companyId })

    expect(deleteSpy).toHaveBeenCalledWith(serviceHourId)
    expect(serviceHour).toEqual(fakeServiceHour)
  })
  it("should return an error if it doesn't find the service hour selected for deletion", async () => {
    const { findServiceHoursRepository, sut } = makeSut()
    jest.spyOn(findServiceHoursRepository, 'findBy').mockImplementationOnce(async () => [])

    const serviceHourId = 'any_id'
    const companyId = 'any_company_id'

    const error = await sut.delete({ serviceHourId, companyId })

    expect(error).toEqual(new Error('Horário de trabalho não encontrado'))
  })
})
