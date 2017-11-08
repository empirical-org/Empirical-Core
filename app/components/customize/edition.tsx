import * as React from 'react';
import { connect } from 'react-redux';
import { getComponent } from './helpers'
import _ from 'lodash'

class CustomizeEdition extends React.Component<any, any> {
  constructor(props) {
    super(props)

    this.state = {
      edition: props.customize.editions[props.params.editionID],
      copiedEdition: props.customize.editions[props.params.editionID]
    }

    this.updateQuestion = this.updateQuestion.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.customize.editions[nextProps.params.editionID], this.props.customize.editions[nextProps.params.editionID])) {
      const edition = nextProps.customize.editions[nextProps.params.editionID]
      if (this.state.edition === undefined) {
        this.setState({copiedEdition: edition, edition: edition})
      } else {
        this.setState({copiedEdition: edition})
      }
    }
  }

  updateQuestion(question, questionIndex) {
    const newEdition = _.merge({}, this.state.edition)
    newEdition.data.questions[questionIndex].data = question
    this.setState({edition: newEdition})
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
      <Component question={q.data} questionIndex={i+1} updateQuestion={this.updateQuestion} save={this.save}/>
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
