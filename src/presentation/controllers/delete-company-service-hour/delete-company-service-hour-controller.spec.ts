import { IDeleteServiceHour } from '@/domain/usecases/delete-service-hour'
import { ServerError } from '@/presentation/errors'
import { noContent, serverError } from '@/presentation/helpers/http/httpHelper'
import { mockAccount } from '@/test/domain/models/mock-account'
import { mockDeleteServiceHour } from '@/test/domain/usecases/mock-delete-service-hour'
import { mockRequest } from '@/test/presentation/mock-http'
import { DeleteCompanyServiceHourController } from './delete-company-service-hour-controller'

const fakeRequest = mockRequest({ params: { serviceHourId: 'any_id' }, body: {}, user: mockAccount() })

type SutTypes = {
  sut: DeleteCompanyServiceHourController
  deleteServiceHour: IDeleteServiceHour
}

const makeSut = (): SutTypes => {
  const deleteServiceHour = mockDeleteServiceHour()
  const sut = new DeleteCompanyServiceHourController(deleteServiceHour)

  return {
    sut,
    deleteServiceHour,
  }
}

describe('DeleteServiceHour Controller', () => {
  it('should return 204 on success', async () => {
    const { sut, deleteServiceHour } = makeSut()
    const deleteSpy = jest.spyOn(deleteServiceHour, 'delete')
    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(noContent())
    expect(deleteSpy).toHaveBeenCalledWith({
      serviceHourId: fakeRequest.params.serviceHourId,
      companyId: fakeRequest.user?.companyId,
    })
  })

  it('should return serverError if DeleteServiceHour throws', async () => {
    const { sut, deleteServiceHour } = makeSut()
    jest.spyOn(deleteServiceHour, 'delete').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(serverError(new ServerError()))
  })
})
