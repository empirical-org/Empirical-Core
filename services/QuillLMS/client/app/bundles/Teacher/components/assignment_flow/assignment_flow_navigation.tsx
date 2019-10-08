import * as React from 'react'
import { Link } from 'react-router'

const quillLogoGreenSrc =  `${process.env.CDN_URL}/images/logos/quill-logo-green.svg`

interface AssignmentFlowNavigationProps {
  button?: JSX.Element;
  unitTemplateId?: string;
  unitTemplateName?: string;
}

const learningProcessUrl = '/assign/learning-process'
const learningProcessRegex = /\/assign\/learning-process$/
const diagnosticUrl = '/assign/diagnostic'
const diagnosticRegex = /\/assign\/diagnostic$/
const activityTypeUrl = '/assign/activity-type'
const activityTypeRegex = /\/assign\/activity-type$/
const createActivityPackUrl = '/assign/create-activity-pack'
const createActivityPackRegex = /\/assign\/create-activity-pack$/
const selectClassesUrl = '/assign/select-classes'
const selectClassesForCustomPackRegex = /\/assign\/select-classes$/
const selectClassesForUnitTemplateRegex = /\/assign\/select-classes\?unit_template_id=\d+$/
const individualFeaturedActivityPackRegex = /\/assign\/featured-activity-packs\/\d+$/
const featuredActivityPacksUrl = '/assign/featured-activity-packs'
const featuredActivityPacksRegex = /\/assign\/featured-activity-packs/

export default class AssignmentFlowNavigation extends React.Component<AssignmentFlowNavigationProps, any> {
  constructor(props) {
    super(props)
  }

  renderButton() {
    const { button, } = this.props
    return button ? button : null
  }

  renderLinks() {
    const { unitTemplateId, unitTemplateName, } = this.props
    const url = window.location.href
    const slash = <span className="slash">/</span>
    let elements = []
    const learningProcess = <Link to={learningProcessUrl}>Learning process</Link>
    const diagnostic = <Link to={diagnosticUrl}>Diagnostic</Link>
    const activityType = <Link to={activityTypeUrl}>Activity type</Link>
    const createActivityPack = <Link to={createActivityPackUrl}>Custom activity pack</Link>
    const selectClasses = <Link to={selectClassesUrl}>Assign</Link>
    const activityPack = <Link to={featuredActivityPacksUrl}>Activity pack</Link>
    const individualFeaturedActivityPack = <Link to={`${featuredActivityPacksUrl}/${unitTemplateId}`}>{unitTemplateName}</Link>
    if (url.match(learningProcessRegex)) {
      elements = [slash, learningProcess]
    } else if (url.match(diagnosticRegex)) {
      elements = [slash, learningProcess, slash, diagnostic]
    } else if (url.match(activityTypeRegex)) {
      elements = [slash, learningProcess, slash, activityType]
    } else if (url.match(createActivityPackRegex)) {
      elements = [slash, learningProcess, slash, activityType, slash, createActivityPack]
    } else if (url.match(selectClassesForCustomPackRegex)) {
      elements = [slash, learningProcess, slash, activityType, slash, createActivityPack, slash, selectClasses]
    } else if (url.match(selectClassesForUnitTemplateRegex)) {
      elements = [slash, learningProcess, slash, activityType, slash, activityPack, slash, individualFeaturedActivityPack, slash, selectClasses]
    } else if (url.match(individualFeaturedActivityPackRegex)) {
      elements = [slash, learningProcess, slash, activityType, slash, activityPack, slash, individualFeaturedActivityPack]
    } else if (url.match(featuredActivityPacksRegex)) {
      elements = [slash, learningProcess, slash, activityType, slash, activityPack]
    }
    return <div className="links">{elements}</div>
  }

  renderProgressBar() {
    const url = window.location.href
    let className
    if (url.match(learningProcessRegex)) {
      className = 'step-one'
    } else if (url.match(diagnosticRegex) || url.match(activityTypeRegex)) {
      className = 'step-two'
    } else if (url.match(individualFeaturedActivityPackRegex)) {
      className = 'step-four'
    } else if (url.match(createActivityPackRegex) || url.match(featuredActivityPacksUrl)) {
      className = 'step-three'
    } else if (url.match(selectClassesForCustomPackRegex) || url.match(selectClassesForUnitTemplateRegex)) {
      className = 'step-five'
    }
    return <div className='progress-bar'><div className={className} /></div>
  }

  render() {
    return (<div className="assignment-flow-navigation">
      <div className="assignment-flow-navigation-container">
        <div className="left">
          <a href="/"><img src={quillLogoGreenSrc} alt="green Quill logo"/></a>
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
