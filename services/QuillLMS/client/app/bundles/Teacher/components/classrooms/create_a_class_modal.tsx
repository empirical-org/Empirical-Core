import * as React from 'react'

import CreateAClassForm from './create_a_class_form'

const closeIconSrc = `${process.env.CDN_URL}/images/icons/close.svg`

interface CreateAClassModalProps {
  close: (event) => void;
}

interface CreateAClassModalState {
  step: number;
}

export default class CreateAClassModal extends React.Component<CreateAClassModalProps, CreateAClassModalState> {
  constructor(props) {
    super(props)

    this.state = {
      step: 1
    }

    this.next = this.next.bind(this)
  }

  next() {
    this.setState({ step: this.state.step + 1 })
  }

  renderHeader() {
    const { step, } = this.state
    return <div className="create-a-class-modal-header">
      <div className="navigation">
        <p className={step === 1 ? 'active' : ''}>1. Create a class</p>
        <p className={step === 2 ? 'active' : ''}>2. Add students</p>
        <p className={step === 3 ? 'active' : ''}>3. Setup instructions</p>
      </div>
      <img src={closeIconSrc} onClick={this.props.close} />
    </div>
  }

  renderModalContent() {
    const { step, } = this.state
    if (step === 1) {
      return <CreateAClassForm next={this.next} />
    } else if (step === 2) {
      return <AddStudents next={this.next} />
    }
  }

  render() {
    return <div className="modal-container create-a-class-modal-container">
      <div className="modal-background" />
      <div className="create-a-class-modal modal">
        {this.renderHeader()}
        {this.renderModalContent()}
      </div>
    </div>
  }
}
