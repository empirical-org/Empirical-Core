import * as React from 'react'

const closeIconSrc = `${process.env.CDN_URL}/images/icons/close.svg`

interface CreateAClassModalProps {
  close: (event) => void;
}

interface CreateAClassModalState {
  step: 1|2|3
}

export default class CreateAClassModal extends React.Component<CreateAClassModalProps, CreateAClassModalState> {
  constructor(props) {
    super(props)

    this.state = {
      step: 1
    }
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

  }

  render() {
    return <div className="modal-container create-a-class-modal-container">
      <div className="modal-background" />
      <div className="create-a-class-modal modal">
        {this.renderHeader()}
        {this.renderModalContent()}}
      </div>
    </div>
  }
}
