import * as React from 'react'
import { Link } from 'react-router-dom'

import { AP_SLUG, COLLEGE_BOARD_SLUG, PRE_AP_SLUG, SPRING_BOARD_SLUG, SOCIAL_STUDIES_SLUG, WORLD_HISTORY_1200_TO_PRESENT_SLUG, } from './assignmentFlowConstants'
import LeavingModal from './leaving_modal'
import parsedQueryParams from './parsedQueryParams'

const quillLogoGreenSrc =  `${process.env.CDN_URL}/images/logos/quill-logo-green.svg`

interface AssignmentFlowNavigationProps {
  button?: JSX.Element;
  unitTemplateId?: string;
  unitTemplateName?: string;
  isFromDiagnosticPath?: boolean;
  courseSlug?: string;
}

const learningProcessSlug = 'learning-process'
const diagnosticSlug = 'diagnostic'
const activityTypeSlug = 'activity-type'
const collegeBoardSlug = COLLEGE_BOARD_SLUG
const activityLibrarySlug = 'activity-library'
const selectClassesSlug = 'select-classes'
const featuredActivityPacksSlug = 'featured-activity-packs'
const preApSlug = PRE_AP_SLUG
const apSlug = AP_SLUG
const springBoardSlug = SPRING_BOARD_SLUG
const socialStudiesSlug = SOCIAL_STUDIES_SLUG
const worldHistory1200ToPresentSlug = WORLD_HISTORY_1200_TO_PRESENT_SLUG

const slash = (index: number) => <span className="slash" key={index}>/</span>
const learningProcess = () => <a href="/assign" key="learning-process">Learning process</a>
const diagnostic = () => <Link key="diagnostic" to={`/assign/${diagnosticSlug}`}>Diagnostic</Link>
const activityType = () => <Link key="activity-type" to={`/assign/${activityTypeSlug}`}>Activity type</Link>
const collegeBoard = () => <Link key="college-board" to={`/assign/${collegeBoardSlug}`}>College Board</Link>
const createActivityPack = () => <Link key="custom-activity-pack" to={`/assign/${activityLibrarySlug}`}>Activity library</Link>
const selectClasses = () => <Link key="assign-" to={`/assign/${selectClassesSlug}`}>Assign</Link>
const activityPack = () => <Link key="activity-pack" to={`/assign/${featuredActivityPacksSlug}`}>Activity pack</Link>
const preAp = () => <Link key="activity-pack" to={`/assign/${preApSlug}`}>Pre-AP</Link>
const ap = () => <Link key="activity-pack" to={`/assign/${apSlug}`}>AP</Link>
const springBoard = () => <Link key="activity-pack" to={`/assign/${springBoardSlug}`}>SpringBoard</Link>
const socialStudies = () => <Link key="social-studies" to={`/assign/${socialStudiesSlug}`}>Social Studies</Link>
const worldHistory1200ToPresent = () => <Link key="world-history-1200-to-present" to={`/assign/${socialStudiesSlug}/${worldHistory1200ToPresentSlug}`}>World History: 1200 CE - Present</Link>

const STEP_ONE = 'step-one'
const STEP_TWO = 'step-two'
const STEP_THREE = 'step-three'
const STEP_FOUR = 'step-four'
const STEP_FIVE = 'step-five'

const individualFeaturedActivityPack = (unitTemplateId, unitTemplateName) => {
  let link = `/assign/${featuredActivityPacksSlug}/${unitTemplateId}`
  const collegeBoardActivityTypeSlug = parsedQueryParams()[collegeBoardSlug]
  if (collegeBoardActivityTypeSlug) {
    link+= `?${collegeBoardSlug}=${collegeBoardActivityTypeSlug}`
  }
  return <Link key="featured-activity-pack" to={link}>{unitTemplateName}</Link>
}

const collegeBoardSlugsToLinks = {
  [preApSlug]: preAp(),
  [apSlug]: ap(),
  [springBoardSlug]: springBoard()
}

const contentHubSlugsToLinks = {
  [WORLD_HISTORY_1200_TO_PRESENT_SLUG]: worldHistory1200ToPresent()
}

const routeLinks = {
  [learningProcessSlug]: () => [slash(1), learningProcess()],
  [diagnosticSlug]: () => [slash(1), learningProcess(), slash(2), diagnostic()],
  [activityTypeSlug]: () => [slash(1), learningProcess(), slash(2), activityType()],
  [preApSlug]: () => [slash(1), learningProcess(), slash(2), collegeBoard(), slash(3), preAp()],
  [apSlug]: () => [slash(1), learningProcess(), slash(2), collegeBoard(), slash(3), ap()],
  [springBoardSlug]: () => [slash(1), learningProcess(), slash(2), collegeBoard(), slash(3), springBoard()],
  [collegeBoardSlug]: () => [slash(1), learningProcess(), slash(2), collegeBoard()],
  [activityLibrarySlug]: () => [slash(1), learningProcess(), slash(2), createActivityPack()],
  [socialStudiesSlug]: ({ courseSlug, }) => {
    if (courseSlug) {
      return [slash(1), learningProcess(), slash(2), socialStudies(), slash(3), contentHubSlugsToLinks[courseSlug]]
    } else {
      return [slash(1), learningProcess(), slash(2), socialStudies()]
    }
  },
  [selectClassesSlug]: ({ unitTemplateId, unitTemplateName, isFromDiagnosticPath, }) => {
    if (isFromDiagnosticPath) {
      return [
        slash(1),
        learningProcess(),
        slash(2),
        diagnostic(),
        slash(3),
        selectClasses()
      ]
    }

    const collegeBoardActivityTypeSlug = parsedQueryParams()[collegeBoardSlug]
    if (collegeBoardActivityTypeSlug) {
      return [slash(1), learningProcess(), slash(2), collegeBoard(), slash(3), collegeBoardSlugsToLinks[collegeBoardActivityTypeSlug], slash(4), individualFeaturedActivityPack(unitTemplateId, unitTemplateName), slash(5), selectClasses()]
    }

    const base = [slash(1), learningProcess(), slash(2), activityType(), slash(3)]
    if (unitTemplateId && unitTemplateName) {
      return base.concat(
        [activityPack(),
          slash(4),
          individualFeaturedActivityPack(unitTemplateId, unitTemplateName),
          slash(5),
          selectClasses()
        ]
      )
    }
    return base.concat([createActivityPack(), slash(4), selectClasses()])
  },
  [featuredActivityPacksSlug]: ({ unitTemplateId, unitTemplateName, }) => {
    const collegeBoardActivityTypeSlug = parsedQueryParams()[collegeBoardSlug]
    if (collegeBoardActivityTypeSlug) {
      return [slash(1), learningProcess(), slash(2), collegeBoard(), slash(3), collegeBoardSlugsToLinks[collegeBoardActivityTypeSlug], slash(4), individualFeaturedActivityPack(unitTemplateId, unitTemplateName)]
    }

    const base = [slash(1), learningProcess(), slash(2), activityType(), slash(3), activityPack()]
    if (unitTemplateId && unitTemplateName) {
      return base.concat([slash(4), individualFeaturedActivityPack(unitTemplateId, unitTemplateName)])
    }
    return base
  }
}

const routeProgress = {
  [learningProcessSlug]: () => STEP_ONE,
  [diagnosticSlug]: () => STEP_TWO,
  [activityTypeSlug]: () => STEP_TWO,
  [collegeBoardSlug]: () => STEP_TWO,
  [socialStudiesSlug]: ({ courseSlug, }) => (courseSlug ? STEP_THREE : STEP_TWO),
  [worldHistory1200ToPresentSlug]: () => STEP_THREE,
  [preApSlug]: () => STEP_THREE,
  [apSlug]: () => STEP_THREE,
  [springBoardSlug]: () => STEP_THREE,
  [activityLibrarySlug]: () => STEP_THREE,
  [selectClassesSlug]: () => STEP_FIVE,
  [featuredActivityPacksSlug]: ({ unitTemplateId, unitTemplateName, }) => {
    if (unitTemplateId && unitTemplateName) {
      return STEP_FOUR
    }
    return STEP_THREE
  }
}

export default class AssignmentFlowNavigation extends React.Component<AssignmentFlowNavigationProps, any> {
  constructor(props) {
    super(props)

    this.state = {
      showLeavingModal: false
    }
  }

  toggleLeavingModal = () => {
    this.setState({ showLeavingModal: !this.state.showLeavingModal })
  }

  getSlug() {
    const path = location.pathname
    // will grab whatever comes after '/assign/' and before another slash
    return path.split('/')[2]
  }

  renderButton() {
    const { button, } = this.props
    return button ? button : null
  }

  renderLinks() {
    const { unitTemplateId, unitTemplateName, isFromDiagnosticPath, courseSlug, } = this.props
    let elements
    try {
      elements = routeLinks[this.getSlug()]({ unitTemplateId, unitTemplateName, isFromDiagnosticPath, courseSlug, })
    } catch {
      elements = []
    }
    return <div className="links">{elements}</div>
  }

  renderProgressBar() {
    const { unitTemplateId, unitTemplateName, courseSlug } = this.props
    let className
    try {
      className = routeProgress[this.getSlug()]({ unitTemplateId, unitTemplateName, courseSlug, })
    } catch {
      className = null
    }
    return <div className='progress-bar'><div className={className} /></div>
  }

  renderLeavingModal() {
    if (this.state.showLeavingModal) {
      return <LeavingModal cancel={this.toggleLeavingModal} />
    }
  }

  render() {
    return (
      <div className="assignment-flow-navigation">
        {this.renderLeavingModal()}
        <div className="assignment-flow-navigation-container">
          <div className="left">
            <button className="interactive-wrapper focus-on-light" onClick={this.toggleLeavingModal} type="button"><img alt="green Quill logo" src={quillLogoGreenSrc} /></button>
            {this.renderLinks()}
          </div>
          <div className="right">
            {this.renderButton()}
          </div>
        </div>
        {this.renderProgressBar()}
      </div>
    )
  }
}
