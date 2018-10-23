import React from 'react';

export default class Input extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      inactive: true,
      errorAcknowledged: false
    }

    this.activateInput = this.activateInput.bind(this)
    this.acknowledgeError = this.acknowledgeError.bind(this)
  }

  activateInput() {
    this.setState({ inactive: false, }, () => this.input.focus())
  }

  acknowledgeError() {
    this.setState({ errorAcknowledged: true }, () => this.input.focus())
  }

  renderHelperText() {
    const { helperText } = this.props
    if (helperText) {
      return <span className="helper-text">{helperText}</span>
    }
  }

  renderErrorText() {
    const { error } = this.props
    const { errorAcknowledged } = this.state
    if (error) {
      return <span className="error-text">{error}</span>
    }
  }

  renderInput() {
    const { inactive, errorAcknowledged} = this.state
    const { className, label, handleChange, value, placeholder, error, type } = this.props
    if (inactive) {
      return (<div className={`input-container inactive ${this.props.className}`} onClick={this.activateInput}>
        <label>{label}</label>
        <input
          ref={(input) => { this.input = input; }}
        />
        {this.renderHelperText()}
      </div>)
    } else if (error ) {
      if (errorAcknowledged) {
        return (<div className={`input-container error ${className}`}>
          <label>{label}</label>
          <input
            ref={(input) => { this.input = input; }}
            onChange={handleChange}
            value={value}
            type={type}
            placeholder={placeholder}
          />
        </div>)
      } else {
        return (<div className={`input-container error unacknowledged ${className}`} onClick={this.acknowledgeError}>
          <label>{label}</label>
          <input
            ref={(input) => { this.input = input; }}
            onChange={handleChange}
            value={value}
            type={type}
            placeholder={placeholder}
          />
          {this.renderErrorText()}
        </div>)
      }
    } else {
      return (<div className={`input-container active ${className}`}>
        <label>{label}</label>
        <input
          ref={(input) => { this.input = input; }}
          onChange={handleChange}
          value={value}
          type={type}
          placeholder={placeholder}
        />
      </div>)
    }
  }

  render() {
    return this.renderInput()
  }


}
