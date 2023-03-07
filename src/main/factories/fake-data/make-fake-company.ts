
import { faker } from '@faker-js/faker'

export const makeFakeCompany = (): Company => ({
  id: faker.datatype.uuid(),
  name: faker.company.name(),
  reservationPrice: faker.datatype.number().toString(),
  reservationTimeInMinutes: faker.datatype.number({
    min: 1,
    max: 180
  }),
  createdAt: new Date(),
  updatedAt: new Date()
})
