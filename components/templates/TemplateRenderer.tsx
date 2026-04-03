import { Invitation } from '@/types'
import BlueYellowScrapbook from './BlueYellowScrapbook'
import CutePink from './CutePink'
import ElegantBlue from './ElegantBlue'
import GrungeSilver from './GrungeSilver'
import GreyBlackInvitation from './GreyBlackInvitation'
import MinimalWhite from './MinimalWhite'
import RedWhiteInvitation from './RedWhiteInvitation'

const TEMPLATE_MAP: Record<string, React.ComponentType<Invitation>> = {
  'blue-yellow-scrapbook': BlueYellowScrapbook,
  'cute-pink': CutePink,
  'elegant-blue': ElegantBlue,
  'grunge-silver': GrungeSilver,
  'grey-black-invitation': GreyBlackInvitation,
  'minimal-white': MinimalWhite,
  'red-white-invitation': RedWhiteInvitation,
}

export default function TemplateRenderer(props: Invitation) {
  const Component = TEMPLATE_MAP[props.template_id] ?? MinimalWhite
  return <Component {...props} />
}
