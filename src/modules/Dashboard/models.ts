export interface PerformanceModel {
  type: string
  max: number
  min: number
  current: number
}

export interface ScoreDistributionModel {
  score: number
  count: number
}
