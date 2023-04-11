export type ReservationSlot = {
  start: string
  end: string
  isAvailable: boolean
}

export type UnformattedReservationSlot = {
  start: Date
  end: Date
  isAvailable: boolean
}
