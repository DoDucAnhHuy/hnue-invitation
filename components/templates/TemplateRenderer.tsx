import { Invitation } from '@/types'
import CutePink from './CutePink'
import ElegantBlue from './ElegantBlue'
import MinimalWhite from './MinimalWhite'

const TEMPLATE_MAP: Record<string, React.ComponentType<Invitation>> = {
  'cute-pink': CutePink,
  'elegant-blue': ElegantBlue,
  'minimal-white': MinimalWhite,
}

export default function TemplateRenderer(props: Invitation) {
  const Component = TEMPLATE_MAP[props.template_id] ?? MinimalWhite
  return <Component {...props} />
}
