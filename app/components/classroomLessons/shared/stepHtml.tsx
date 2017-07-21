import * as React from 'react'

import {
  ScriptItem
} from 'interfaces/classroomLessons'


interface StepHtmlProps {
  onlyShowHeaders: boolean,
  item: ScriptItem
}

export default class StepHtml extends React.Component<StepHtmlProps, any> {
  constructor(props) {
    super(props)
  }

  render() {
    if (this.props.item.data) {
      const html = this.props.onlyShowHeaders
        ? <li className="script-item"><p className="script-item-heading">{this.props.item.data.heading}</p></li>
        : (<li className="script-item">
          <p className="script-item-heading">{this.props.item.data.heading}</p>
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
