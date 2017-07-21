import * as React from 'react'

import {
  ScriptItem
} from 'interfaces/classroomLessons'


interface StepHtmlProps {
  onlyShowHeaders: boolean,
  item: ScriptItem
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

  header() {
    if (this.props.item.data && this.props.item.data.heading) {
      return <p className="script-item-heading" onClick={this.toggleHideBody}>{this.props.item.data.heading}</p>
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.onlyShowHeaders !== this.props.onlyShowHeaders) {
      this.setState({hideBody: nextProps.onlyShowHeaders})
    }
  }

  toggleHideBody() {
    this.setState({hideBody: !this.state.hideBody})
  }

  render() {
    if (this.props.item.data) {
      const html = this.state.hideBody
        ? <li className="script-item">{this.header()}</li>
        : (<li className="script-item">
          {this.header()}
          <hr />
          <div dangerouslySetInnerHTML={{ __html: this.props.item.data.body, }} />
        </li>)
      return html
  } else {
    return <span/>
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
