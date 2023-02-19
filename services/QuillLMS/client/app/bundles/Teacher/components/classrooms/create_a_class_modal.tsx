import * as React from 'react'

import CreateAClassForm from './create_a_class_form'
import AddStudents from './add_students'
import SetupInstructions from './setup_instructions'

const closeIconSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/icons/close.svg`

interface CreateAClassModalProps {
  close: (event) => void;
  showSnackbar: (event) => void;
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
      classroom: {}
    }

    this.next = this.next.bind(this)
    this.back = this.back.bind(this)
    this.setClassroom = this.setClassroom.bind(this)
    this.setStudents = this.setStudents.bind(this)
  }

  next() {
    this.setState({ step: this.state.step + 1 })
  }

  back() {
    this.setState({ step: this.state.step - 1 })
  }

  setClassroom(classroom) {
    this.setState({ classroom })
  }

  setStudents(students) {
    const classroom = Object.assign({}, this.state.classroom)
    classroom.students = students
    this.setState({ classroom })
  }

  renderHeader() {
    const { step, } = this.state
    const { close, } = this.props
    return (
      <div className="create-a-class-modal-header">
        <div className="navigation">
          <p className={step === 1 ? 'active' : ''}>1. Create a class</p>
          <p className={step === 2 ? 'active' : ''}>2. Add students</p>
          <p className={step === 3 ? 'active' : ''}>3. Setup instructions</p>
        </div>
        <button className="interactive-wrapper focus-on-light" onClick={close} type="button"><img alt="Close icon" src={closeIconSrc} /></button>
      </div>
    )
  }

  renderModalContent() {
    const { close, showSnackbar, } = this.props
    const { step, classroom, } = this.state
    if (step === 1) {
      return <CreateAClassForm next={this.next} setClassroom={this.setClassroom} />
    } else if (step === 2) {
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
