import * as React from 'react';
import { connect } from 'react-redux';
import { getComponent } from './helpers'
import _ from 'lodash'

export default class Slide extends React.Component<any, any> {
  constructor(props) {
    super(props)

    this.state = {
      show: true
    }

    this.toggleShow = this.toggleShow.bind(this)
  }

  toggleShow() {
    this.setState({show: !this.state.show})
  }

  renderComponent() {
    if (this.state.show) {
      const Component = getComponent(this.props.question.type)
      return <Component
        question={this.props.question.data}
        questionIndex={this.props.questionIndex}
        updateQuestion={this.props.updateQuestion}
        clearSlide={this.props.clearSlide}
        resetSlide={this.props.resetSlide}
        />
    }
  }

  render() {
    const Component = getComponent(this.props.question.type)
    return <div className="slide-container" key={this.props.questionIndex}>
      <div className='slide-header'>
      <span className="slide-number">Slide {this.props.questionIndex}</span>
      <span className="line"></span>
      <span onClick={this.toggleShow} className="hide">Hide</span>
      </div>
      {this.renderComponent()}
    </div>
  }
}
