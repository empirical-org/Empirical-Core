import * as React from 'react'

import { Input } from 'quill-component-library/dist/componentLibrary'

import { requestPut } from '../../../../modules/request/index.js';

interface RenameClassModalProps {
  close: () => void;
  onSuccess: (string) => void;
  classroom: any;
}

interface RenameClassModalState {
  name: string;
  timesSubmitted: number;
  errors: { [key:string]: string };
}

export default class RenameClassModal extends React.Component<RenameClassModalProps, RenameClassModalState> {
  constructor(props) {
    super(props)

    this.state = {
      name: props.classroom.name,
      errors: {},
      timesSubmitted: 0
    }

    this.handleNameChange = this.handleNameChange.bind(this)
    this.renameClass = this.renameClass.bind(this)
  }

  handleNameChange(event) {
    this.setState({ name: event.target.value })
  }

  renameClass() {
    const existingClassroom = this.props.classroom
    const { onSuccess, close, } = this.props
    const { name, timesSubmitted, } = this.state
    const classroom = { name }
    requestPut(`/teachers/classrooms/${existingClassroom.id}`, { classroom, }, (body) => {
      if (body && body.errors) {
        this.setState({ errors: body.errors, timesSubmitted: timesSubmitted + 1 });
      } else {
        onSuccess('Class renamed')
        close()
      }
    })
  }

  submitButtonClass() {
    const { classroom } = this.props
    const { name } = this.state
    let buttonClass = 'quill-button contained primary medium';
    if (!name.length || classroom.name === name) {
      buttonClass += ' disabled';
    }
    return buttonClass;
  }

  render() {
    const { name, errors, timesSubmitted } = this.state
    return <div className="modal-container rename-class-modal-container">
      <div className="modal-background" />
      <div className="rename-class-modal modal modal-body">
        <div>
          <h3 className="title">Rename your class</h3>
        </div>
        <Input
          label="Class name"
          value={name}
          handleChange={this.handleNameChange}
          type="text"
          className="name"
          error={errors.name}
          timesSubmitted={timesSubmitted}
          characterLimit={50}
        />
        <div className="form-buttons">
          <button className="quill-button outlined secondary medium" onClick={this.props.close}>Cancel</button>
          <button className={this.submitButtonClass()} onClick={this.renameClass}>Save</button>
        </div>
      </div>
    </div>
  }
}
