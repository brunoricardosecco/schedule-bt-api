import { RoleEnum } from '@/domain/enums/role-enum'
import { FindServiceHoursModel, IFindServiceHours } from '@/domain/usecases/find-service-hours'
import { ServerError } from '@/presentation/errors'
import { ok, serverError } from '../../helpers/http/httpHelper'
import { HttpRequest, ServiceHour } from '../add-service-hour/add-service-hour-controller.protocols'
import { FindCompanyServiceHoursController } from './find-company-service-hours-controller'

const makeFakeServiceHour = (): ServiceHour => ({
  companyId: 'any_company_id',
  endTime: 'any_start_time',
  startTime: 'any_end_time',
  weekday: 0,
  id: 'any_id',
})
const fakeServiceHour = makeFakeServiceHour()

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {},
    query: {
      weekday: '0',
    },
    user: {
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      hashedPassword: 'valid_password',
      role: RoleEnum.COMPANY_ADMIN,
      companyId: 'any_id',
      company: null,
      emailValidationToken: null,
      emailValidationTokenExpiration: null,
      isConfirmed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  }
}
const fakeRequest = makeFakeRequest()

const makeFindServiceHours = (): IFindServiceHours => {
  class FindServiceHoursStub implements IFindServiceHours {
    async find({ companyId, weekday }: FindServiceHoursModel): Promise<ServiceHour[]> {
      return await new Promise(resolve => {
        resolve([fakeServiceHour])
      })
    }
  }

  return new FindServiceHoursStub()
}

type SutTypes = {
  sut: FindCompanyServiceHoursController
  findServiceHours: IFindServiceHours
}

const makeSut = (): SutTypes => {
  const findServiceHours = makeFindServiceHours()
  const sut = new FindCompanyServiceHoursController(findServiceHours)

  return {
    findServiceHours,
    sut,
  }
}

describe('FindCompanyServiceHours Controller', () => {
  it('should return 200 on success', async () => {
    const { sut, findServiceHours } = makeSut()
    const findSpy = jest.spyOn(findServiceHours, 'find')

    const httpResponse = await sut.handle(fakeRequest)

    expect(findSpy).toHaveBeenCalledWith({
      companyId: 'any_id',
      weekday: 0,
    })
    expect(httpResponse).toEqual(
      ok({
        serviceHours: [fakeServiceHour],
      })
    )
  })
  it('should return 500 if FindServiceHour throws', async () => {
    const { sut, findServiceHours } = makeSut()
    jest.spyOn(findServiceHours, 'find').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => {
        reject(new Error())
      })
    })

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(serverError(new ServerError()))
  })
})
