import { ReservationSlot } from '@/domain/models/reservation-slot'
import { FindReservationSlotsParams, IFindReservationSlots } from '@/domain/usecases/find-reservation-slots'

export const mockFindReservationSlots = (): IFindReservationSlots => {
  class FindReservationSlotsStub implements IFindReservationSlots {
    async find({ date, companyId }: FindReservationSlotsParams): Promise<ReservationSlot[] | Error> {
      return await Promise.resolve([])
    }
  }

  return new FindReservationSlotsStub()
}
