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

  componentWillReceiveProps(nextProps) {
    if (nextProps.error !== this.props.error && this.state.errorAcknowledged) {
      this.setState({ errorAcknowledged: false, })
    }
  }

  activateInput() {
    this.setState({ inactive: false, }, () => this.input.focus())
  }

  acknowledgeError() {
    this.setState({ errorAcknowledged: true }, () => this.input.focus())
  }

  handleTab(event) {
    if (event.key === 'Tab') {
      const form = event.target.form;
      const index = Array.prototype.indexOf.call(form, event.target);
      form.elements[index + 1].focus();
      event.preventDefault();
    }
  }

  renderHelperText() {
    const { helperText } = this.props
    if (helperText) {
      return <span className="helper-text">{helperText}</span>
    }
  }

  renderErrorText() {
    const { error } = this.props
    if (error) {
      return <span className="error-text">{error}</span>
    }
  }

  renderInput() {
    const { inactive, errorAcknowledged} = this.state
    const { className, label, handleChange, value, placeholder, error, type, id } = this.props
    if (inactive) {
      return (<div className={`input-container inactive ${this.props.className}`} onClick={this.activateInput}>
        <label>{label}</label>
        <input
          id={id}
          ref={(input) => { this.input = input; }}
          onFocus={this.activateInput}
        />
        {this.renderHelperText()}
      </div>)
    } else if (error ) {
      if (errorAcknowledged) {
        return (<div className={`input-container error ${className}`}>
          <label>{label}</label>
          <input
            id={id}
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
            id={id}
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
          id={id}
          ref={(input) => { this.input = input; }}
          onChange={handleChange}
          value={value}
          type={type}
          placeholder={placeholder}
          onKeyDown={this.handleTab}
        />
      </div>)
    }
  }

  render() {
    return this.renderInput()
  }


}
