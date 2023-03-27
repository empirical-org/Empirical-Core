import * as React from 'react';
import { Link } from 'react-router-dom';

export class ExpandLessonQuestions extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    const { showHideButtonText } = this.props

    this.state = {
      expanded: false,
      showHideButtonText: showHideButtonText['show']
    }
  }

  handleToggleShow = () => {
    const { expanded } = this.state
    const { showHideButtonText } = this.props
    this.setState({ expanded: !expanded})
    if (!expanded) {
      this.setState({ showHideButtonText: showHideButtonText['hide']})
    } else {
      this.setState({ showHideButtonText: showHideButtonText['show']})
    }
  }

  renderDivEls = (els) => {
    const { expanded } = this.state
    if (expanded) {
      return els.map((el, i) => {return <p key={i}>{(i+1).toString().concat(". " + el.replace(/<p>/g, '').replace(/<\/p>/g, ''))}</p>})
    }
  }


  render() {
    const { text, basePath, itemKey, listElements, goToButtonText } = this.props
    const { showHideButtonText } = this.state
    return (
      <li style={{borderBottom: '1px solid lightgray', padding: '5px', display: 'flex', flexFlow: 'wrap'}}>
        <button onClick={this.handleToggleShow} style={{fontWeight: 600, fontSize: '100%', fontFamily: 'inherit', border: 0, padding: 0, width: '550px', textAlign: 'left'}} type="button">{text}</button>
        <Link style={{marginLeft: 'auto', padding: '0px'}} to={basePath + '/' + itemKey}>
          <button className="button" style={{border: '1px solid lightgray'}} type="button">{goToButtonText}</button>
        </Link>
        <button className="button" onClick={this.handleToggleShow} style={{border: '1px solid lightgray', marginLeft: '5px'}} type="button">{showHideButtonText}</button>
        <div className="break" style={{flexBasis: '100%', height: 0}} />
        <div style={{marginLeft: '20px'}}>{this.renderDivEls(listElements)}</div>
      </li>
    )
  }
}
