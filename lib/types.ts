export interface SituationCard {
  id: string
  card_text: string
  display_order: number
  created_at: string
}

export interface CoachingResponse {
  guardrail: boolean
  message?: string
  situationUnderstanding?: string
  trainingPrinciple?: string
  howToThinkAboutIt?: string
  suggestedResponse?: string
  reflectionQuestion?: string
  ethicalReminder?: string
}

export interface CoachingRequest {
  situation: string
  whatHappened: string
  desiredOutcome: string
  isFreeForm?: boolean
  freeFormDescription?: string
}
