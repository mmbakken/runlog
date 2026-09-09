export type Run = {
  _id: string
  userId: string
  name: string
  startDate: string // DateTime string like "2023-03-20T23:07:39.000Z"
  startDateLocal: string
  timezone: string
  title: string
  time: number
  distance: number
  averageSpeed: number
  totalElevationGain: number
  hasHeartRate: boolean
  averageHeartRate: number
  maxHeartRate: number
  deviceName: string
  stravaActivityId: string
  stravaExternalId: string
  startLatitude: number
  startLongitude: number
  startLocation: string
  results: string | null
  shoes: string | null
  ice: boolean
  stretch: boolean
  strength: boolean
  shoeId: string | null
}

export type UpdateRunPayload = {
  updates: {
    results?: string
    strength?: boolean
    stretch?: boolean
    ice?: boolean
    shoeId?: string
    title?: string
  }
}

export type DistanceTypes = "Between" | "Less Than" | "More Than" | "Exactly"

export type HabitTypes = "strength" | "stretch" | "ice"

export type Shoe = {
  _id: string
  userId: string
  title: string
  runIds: string[]
  distance: number
}
