import React from 'react';

export default class MissedLessonRow extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showTooltip: false
    }
  }

  hideTooltip = () => {
    this.setState({ showTooltip: false, });
  };

  showTooltip = () => {
    this.setState({ showTooltip: true, });
  };

  tooltip() {
    const tooltipStyle = {
      display: this.state.showTooltip ? 'flex' : 'none',
      fontSize: '12px',
      background: '#348fdf',
      color: 'white',
      lineHeight: 'normal',
      zIndex: 100,
      borderRadius: '3px',
      bottom: '-34px',
      left: '11px',
      alignItems: 'center',
      padding: '3px 0px 5px',
      justifyContent: 'center',
      position: 'absolute',
      width: '205px'
    }
    const caretStyle={
      position: 'relative',
      bottom: '22px',
      left: '10px',
      fontSize: '16px',
      color: '#348fdf',
    }
    return (
      <div style={tooltipStyle}>
        <i className="fas fa-caret-up" style={caretStyle} />
      You can reassign this lesson to the students who missed it.
      </div>
    )
  }

  render() {
    return (
      <tr className='not-completed-row' key={this.props.name}>
        <td>{this.props.name}</td>
        <td colSpan='3' style={{position: 'relative'}}>
          <span onMouseEnter={this.showTooltip} onMouseLeave={this.hideTooltip}>
            Missed Lesson
            {this.tooltip()}
          </span>
        </td>
      </tr>
    )
  }
}
