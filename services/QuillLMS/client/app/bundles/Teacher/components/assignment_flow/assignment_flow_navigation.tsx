import * as React from 'react'
import { Link } from 'react-router-dom'

import LeavingModal from './leaving_modal'

import { ANONYMOUS_ASSIGN_UNIT_TEMPLATE_ID } from './localStorageKeyConstants'

const quillLogoGreenSrc =  `${process.env.CDN_URL}/images/logos/quill-logo-green.svg`

interface AssignmentFlowNavigationProps {
  button?: JSX.Element;
  unitTemplateId?: string;
  unitTemplateName?: string;
  isFromDiagnosticPath?: boolean;
}

const learningProcessSlug = 'learning-process'
const diagnosticSlug = 'diagnostic'
const activityTypeSlug = 'activity-type'
const createActivityPackSlug = 'create-activity-pack'
const selectClassesSlug = 'select-classes'
const featuredActivityPacksSlug = 'featured-activity-packs'

const slash = (index: number) => <span className="slash" key={index}>/</span>
const learningProcess = () => <Link key="learning-process" to={`/assign/${learningProcessSlug}`}>Learning process</Link>
const diagnostic = () => <Link key="diagnostic" to={`/assign/${diagnosticSlug}`}>Diagnostic</Link>
const activityType = () => <Link key="activity-type" to={`/assign/${activityTypeSlug}`}>Activity type</Link>
const createActivityPack = () => <Link key="custom-activity-pack" to={`/assign/${createActivityPackSlug}`}>Custom activity pack</Link>
const selectClasses = () => <Link key="assign-" to={`/assign/${selectClassesSlug}`}>Assign</Link>
const activityPack = () => <Link key="activity-pack" to={`/assign/${featuredActivityPacksSlug}`}>Activity pack</Link>
const individualFeaturedActivityPack = (unitTemplateId, unitTemplateName) => <Link key="featured-activity-pack" to={`/assign/${featuredActivityPacksSlug}/${unitTemplateId}`}>{unitTemplateName}</Link>

const routeLinks = {
  [learningProcessSlug]: () => [slash(1), learningProcess()],
  [diagnosticSlug]: () => [slash(1), learningProcess(), slash(2), diagnostic()],
  [activityTypeSlug]: () => [slash(1), learningProcess(), slash(2), activityType()],
  [createActivityPackSlug]: () => [slash(1), learningProcess(), slash(2), activityType(), slash(3), createActivityPack()],
  [selectClassesSlug]: (unitTemplateId, unitTemplateName, isFromDiagnosticPath) => {
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
  [featuredActivityPacksSlug]: (unitTemplateId, unitTemplateName) => {
    const base = [slash(1), learningProcess(), slash(2), activityType(), slash(3), activityPack()]
    if (unitTemplateId && unitTemplateName) {
      return base.concat([slash(4), individualFeaturedActivityPack(unitTemplateId, unitTemplateName)])
    }
    return base
  }
}

const routeProgress = {
  [learningProcessSlug]: () => 'step-one',
  [diagnosticSlug]: () => 'step-two',
  [activityTypeSlug]: () => 'step-two',
  [createActivityPackSlug]: () => 'step-three',
  [selectClassesSlug]: () => 'step-five',
  [featuredActivityPacksSlug]: (unitTemplateId, unitTemplateName) => {
    if (unitTemplateId && unitTemplateName) {
      return 'step-four'
    }
    return 'step-three'
  }
}

export default class AssignmentFlowNavigation extends React.Component<AssignmentFlowNavigationProps, any> {
  constructor(props) {
    super(props)

    this.state = {
      showLeavingModal: false
    }
  }

  componentDidMount() {
    // we want to remove the anonymous assign unit template id every time we enter the assignment flow because otherwise we could end up in a loop where the user keeps getting directed back here from the home page
    window.localStorage.removeItem(ANONYMOUS_ASSIGN_UNIT_TEMPLATE_ID)
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
    const { unitTemplateId, unitTemplateName, isFromDiagnosticPath } = this.props
    let elements
    try {
      elements = routeLinks[this.getSlug()](unitTemplateId, unitTemplateName, isFromDiagnosticPath)
    } catch {
      elements = []
    }
    return <div className="links">{elements}</div>
  }

  renderProgressBar() {
    const { unitTemplateId, unitTemplateName } = this.props
    let className
    try {
      className = routeProgress[this.getSlug()](unitTemplateId, unitTemplateName)
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
    return (<div className="assignment-flow-navigation">
      {this.renderLeavingModal()}
      <div className="assignment-flow-navigation-container">
        <div className="left">
          <img alt="green Quill logo" onClick={this.toggleLeavingModal} src={quillLogoGreenSrc} />
          {this.renderLinks()}
        </div>
        <div className="right">
          {this.renderButton()}
        </div>
      </div>
      {this.renderProgressBar()}
    </div>)
  }
}
