import * as React from 'react'
import { Link } from 'react-router'

import LeavingModal from './leaving_modal'

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

const slash = () => <span className="slash">/</span>
const learningProcess = () => <Link to={`/assign/${learningProcessSlug}`}>Learning process</Link>
const diagnostic = () => <Link to={`/assign/${diagnosticSlug}`}>Diagnostic</Link>
const activityType = () => <Link to={`/assign/${activityTypeSlug}`}>Activity type</Link>
const createActivityPack = () => <Link to={`/assign/${createActivityPackSlug}`}>Custom activity pack</Link>
const selectClasses = () => <Link to={`/assign/${selectClassesSlug}`}>Assign</Link>
const activityPack = () => <Link to={`/assign/${featuredActivityPacksSlug}`}>Activity pack</Link>
const individualFeaturedActivityPack = (unitTemplateId, unitTemplateName) => <Link to={`/assign/${featuredActivityPacksSlug}/${unitTemplateId}`}>{unitTemplateName}</Link>

const routeLinks = {
  [learningProcessSlug]: () => [slash(), learningProcess()],
  [diagnosticSlug]: () => [slash(), learningProcess(), slash(), diagnostic()],
  [activityTypeSlug]: () => [slash(), learningProcess(), slash(), activityType()],
  [createActivityPackSlug]: () => [slash(), learningProcess(), slash(), activityType(), slash(), createActivityPack()],
  [selectClassesSlug]: (unitTemplateId, unitTemplateName, isFromDiagnosticPath) => {
    if (isFromDiagnosticPath && unitTemplateId && unitTemplateName) {
      return [
        slash(),
        learningProcess(),
        slash(),
        diagnostic(),
        slash(),
        individualFeaturedActivityPack(unitTemplateId, unitTemplateName),
        slash(),
        selectClasses()
      ]
    }

    const base = [slash(), learningProcess(), slash(), activityType(), slash()]
    if (unitTemplateId && unitTemplateName) {
      return base.concat(
        [activityPack(),
          slash(),
          individualFeaturedActivityPack(unitTemplateId, unitTemplateName),
          slash(),
          selectClasses()
        ]
      )
    }
    return base.concat([createActivityPack(), slash(), selectClasses()])
  },
  [featuredActivityPacksSlug]: (unitTemplateId, unitTemplateName) => {
    const base = [slash(), learningProcess(), slash(), activityType(), slash(), activityPack()]
    if (unitTemplateId && unitTemplateName) {
      return base.concat([slash(), individualFeaturedActivityPack(unitTemplateId, unitTemplateName)])
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
      elements = null
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
          <img onClick={this.toggleLeavingModal} src={quillLogoGreenSrc} alt="green Quill logo"/>
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
