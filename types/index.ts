export interface FieldLimits {
  name: number
  time: number
  location: number
  message: number
}

export interface Template {
  id: string
  name: string
  description: string
  keywords: string[]
  preview_url: string
  color_scheme: string
  fieldLimits: FieldLimits
}

export interface Invitation {
  id: string
  name: string
  class: string
  time: string
  location: string
  message: string
  images: string[]
  template_id: string
  created_at: string
}

export type CreateInvitationInput = Omit<Invitation, 'id' | 'created_at'>
