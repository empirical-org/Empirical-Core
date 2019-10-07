import React from 'react'
import { Link } from 'react-router'

const quillLogoGreenSrc =  `${process.env.CDN_URL}/images/logos/quill-logo-green.svg`

interface AssignmentFlowNavigationProps {
  url: string;
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

export default class AssignmentFlowNavigation extends React.Component<AssignmentFlowNavigationProps, any> {
  constructor(props) {
    super(props)
  }

  renderButton() {
    const { button, } = this.props
    return button ? button : null
  }

  renderLinks() {
    const { url, } = this.props
    const slash = <span className="slash">/</span>
    let elements = []
    const learningProcess = <Link to={learningProcessUrl}>Learning process</Link>
    const diagnostic = <Link to={diagnosticUrl}>Diagnostic</Link>
    const activityType = <Link to={activityTypeUrl}>Activity type</Link>
    const createActivityPack = <Link to={createActivityPackUrl}>Custom activity pack</Link>
    const selectClasses = <Link to={selectClassesUrl}>Assign</Link>
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
      elements = [slash, learningProcess, slash, activityType, slash, createActivityPack, slash, selectClasses]
    }
    return <div className="links">{elements}</div>
  }

  renderProgressBar() {
    const { url, } = this.props
    let className
    if (url.match(learningProcessRegex)) {
      className = 'step-one'
    } else if (url.match(diagnosticRegex) || url.match(activityTypeRegex)) {
      className = 'step-two'
    } else if (url.match(createActivityPackRegex)) {
      className = 'step-three'
    } else if (url.match(selectClassesForCustomPackRegex) || url.match(selectClassesForUnitTemplateRegex)) {
      className = 'step-four'
    }
    return <div className='progress-bar'><div className={className} /></div>
  }

  render() {
    return (<div className="assignment-flow-navigation">
      <div className="container">
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
