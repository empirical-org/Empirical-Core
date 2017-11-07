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
      return this.state.edition.data.questions.map((q) => {
        const Component = getComponent(q.type)
        return <Component question={q.data} save={this.save}/>      })
    }
  }

  render() {
    return <div>
    <span>Customize Edition Page</span>
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
