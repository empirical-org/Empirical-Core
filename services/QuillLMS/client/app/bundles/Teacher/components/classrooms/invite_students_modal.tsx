import * as React from 'react'

import AddStudents from './add_students'
import SetupInstructions from './setup_instructions'

const closeIconSrc = `${process.env.CDN_URL}/images/icons/close.svg`

interface CreateAClassModalProps {
  close: (event) => void;
  showSnackbar: (event) => void;
  classroom: any;
}

interface CreateAClassModalState {
  step: number;
  classroom: any;
}

export default class CreateAClassModal extends React.Component<CreateAClassModalProps, CreateAClassModalState> {
  constructor(props) {
    super(props)

    this.state = {
      step: 1,
      classroom: props.classroom
    }

    this.next = this.next.bind(this)
    this.back = this.back.bind(this)
    this.setStudents = this.setStudents.bind(this)
  }

  setStudents(students) {
    const classroom = Object.assign({}, this.state.classroom)
    classroom.students = students
    this.setState({ classroom })
  }

  next() {
    this.setState({ step: this.state.step + 1 })
  }

  back() {
    this.setState({ step: this.state.step - 1 })
  }

  renderHeader() {
    const { step, } = this.state
    const { close, } = this.props
    return (
      <div className="create-a-class-modal-header">
        <div className="navigation">
          <p className={step === 1 ? 'active' : ''}>1. Add students</p>
          <p className={step === 2 ? 'active' : ''}>2. Setup instructions</p>
        </div>
        <button className="interactive-wrapper focus-on-light" onClick={close} type="button"><img alt="Close icon" src={closeIconSrc} /></button>
      </div>
    )
  }

  renderModalContent() {
    const { close, showSnackbar, } = this.props
    const { step, classroom, } = this.state
    if (step === 1) {
      return <AddStudents classroom={classroom} next={this.next} setStudents={this.setStudents} showSnackbar={showSnackbar} />
    } else {
      return <SetupInstructions back={this.back} classroom={classroom} close={close} />
    }
  }

  render() {
    return (
      <div className="modal-container create-a-class-modal-container">
        <div className="modal-background" />
        <div className="create-a-class-modal quill-modal">
          {this.renderHeader()}
          {this.renderModalContent()}
        </div>
      </div>
    )
  }
}
