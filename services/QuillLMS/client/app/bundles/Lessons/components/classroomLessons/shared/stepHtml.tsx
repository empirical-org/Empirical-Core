import * as React from 'react'

import {
    ScriptItem
} from '../../../interfaces/classroomLessons'


interface StepHtmlProps {
  onlyShowHeaders?: boolean,
  item: ScriptItem,
  updateToggledHeaderCount?: Function
  isTip: boolean,
}

interface StepHtmlState {
  hideBody: boolean
}

export default class StepHtml extends React.Component<StepHtmlProps, StepHtmlState> {
  constructor(props) {
    super(props)

    this.state = {
      hideBody: props.onlyShowHeaders
    }

    this.toggleHideBody = this.toggleHideBody.bind(this)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.onlyShowHeaders !== this.props.onlyShowHeaders) {
      this.setState({hideBody: nextProps.onlyShowHeaders})
    }
  }

  header() {
    if (this.props.item.data && this.props.item.data.heading) {
      return <button className="script-item-heading interactive-wrapper focus-on-light" onClick={this.toggleHideBody} type="button">{this.props.item.data.heading}</button>
    }
  }

  toggleHideBody() {
    this.setState({hideBody: !this.state.hideBody}, () => {this.updateToggledHeaderCount()})
  }

  updateToggledHeaderCount() {
    if (this.props.updateToggledHeaderCount) {
      this.state.hideBody !== this.props.onlyShowHeaders ? this.props.updateToggledHeaderCount(1) : this.props.updateToggledHeaderCount(-1)
    }
  }

  render() {
    if (this.props.item.data) {
      const tipClass = this.props.isTip ? "script-item example-discussion" : "script-item";
      const html = this.state.hideBody
        ? <li className={tipClass}>{this.header()}</li>
        : (<li className={tipClass}>
          {this.header()}
          <hr />
          <div dangerouslySetInnerHTML={{ __html: this.props.item.data.body, }} />
        </li>)
      return html
    } else {
      return <span />
    }
  // return  renderStepHTML(item: ScriptItem, onlyShowHeaders: boolean | null, index: number) {
  //     if (item.data) {
  //       const html = onlyShowHeaders
  //         ? <li className="script-item" key={index}><p className="script-item-heading">{item.data.heading}</p></li>
  //         : (<li className="script-item" key={index}>
  //           <p className="script-item-heading">{item.data.heading}</p>
  //           <hr />
  //           <div dangerouslySetInnerHTML={{ __html: item.data.body, }} />
  //         </li>)
  //       return html
  //     }
  }

}
