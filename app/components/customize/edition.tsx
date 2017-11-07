import * as React from 'react';
import { connect } from 'react-redux';
import { getComponent } from './helpers'

class CustomizeEdition extends React.Component<any, any> {
  constructor(props) {
    super(props)

    this.state = {
      edition: props.customize.editions[props.params.editionID]
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.customize.editions[nextProps.params.editionID])) {
      this.setState({edition: nextProps.customize.editions[nextProps.params.editionID]})
    }
  }

  save() {

  }

  renderSlides() {
    if (this.state.edition) {
      return this.state.edition.data.questions.slice(1).map((q, i) => this.renderSlide(q, i))
    }
  }

  renderSlide(q, i) {
    const Component = getComponent(q.type)
    return <div className="slide-container">
      <div className='slide-header'>
        <span className="slide-number">Slide {i + 1}</span>
        <span className="line"></span>
        <span className="hide">Hide</span>
      </div>
      <Component question={q.data} save={this.save}/>
    </div>
  }

  render() {
    return <div className="customize-edition">
    {this.renderSlides()}
    </div>
  }
}

function select(state) {
  return {
    customize: state.customize,
    classroomLesson: state.classroomLesson
  }
}

export default connect(select)(CustomizeEdition)
