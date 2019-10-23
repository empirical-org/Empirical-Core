import React from 'react';

interface InputProps {
  timesSubmitted?: Number;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  value?: string;
  placeholder?: string;
  type?: string;
  id?: string;
  handleCancel?: (event: any) => void;
  helperText?: string;
  handleChange?: (event: any) => void;
  onClick?: (event: any) => void;
  characterLimit?: number;
}

interface InputState {
  inactive: boolean;
  errorAcknowledged: boolean;
}

export class Input extends React.Component<InputProps, InputState> {
  private input: any // eslint-disable-line react/sort-comp
  private node: any // eslint-disable-line react/sort-comp

  constructor(props) {
    super(props)

    this.state = {
      inactive: true,
      errorAcknowledged: false
    }

    this.activateInput = this.activateInput.bind(this)
    this.acknowledgeError = this.acknowledgeError.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleTabOrEnter = this.handleTabOrEnter.bind(this)
    this.deactivateInput = this.deactivateInput.bind(this)
  }

  componentWillMount() {
    document.addEventListener('mousedown', this.handleClick, false)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error !== this.props.error && this.state.errorAcknowledged) {
      this.setState({ errorAcknowledged: false, })
    } else if (nextProps.timesSubmitted !== this.props.timesSubmitted && nextProps.error && this.state.errorAcknowledged) {
      this.setState({ errorAcknowledged: false, })
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false)
  }

  activateInput() {
    if (!this.props.disabled) {
      this.setState({ inactive: false, }, () => this.input.focus())
    }
  }

  deactivateInput() {
    this.setState({ inactive: true, })
  }

  handleClick(e) {
    if (!this.node.contains(e.target)) {
      this.deactivateInput()
    }
  }

  acknowledgeError() {
    this.setState({ errorAcknowledged: true, inactive: false, }, () => this.input.focus())
  }

  handleTabOrEnter(event) {
    if (event.key === 'Tab') {
      const form = event.target.form;
      const index = Array.prototype.indexOf.call(form, event.target);
      form.elements[index + 1].focus();
      event.preventDefault();
      this.deactivateInput()
    }
    if (event.key === 'Enter') {
      this.deactivateInput()
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

  renderCancelSymbol() {
    const { inactive } = this.state
    const { handleCancel } = this.props
    if (!inactive && handleCancel) {
      return <div className="cancel" onClick={handleCancel}><i className="fas fa-times" /></div>
    }
  }

  renderCharacterLimit() {
    const { characterLimit, value, } = this.props
    if (characterLimit) {
      return <div className="character-limit"><span>{value.length}/{characterLimit}</span></div>
    }
  }

  renderInput() {
    const { inactive, errorAcknowledged} = this.state
    const { className, label, handleChange, value, placeholder, error, type, id, disabled, characterLimit } = this.props
    const hasText = value ? 'has-text' : ''
    const inactiveOrActive = inactive ? 'inactive' : 'active'
    const hasCharacterLimit = characterLimit ? 'has-character-limit' : ''
    const sharedClassNames = `input-container  ${inactiveOrActive} ${hasText} ${className} ${hasCharacterLimit}`
    const commonProps = {
      id,
      ref: (input) => { this.input = input; },
      onChange: handleChange,
      value,
      type,
      placeholder,
      disabled,
      maxLength: characterLimit ? characterLimit : 10000
    }
    if (error) {
      if (errorAcknowledged) {
        return (<div
          className={`${sharedClassNames} error`}
          onClick={this.activateInput}
          ref={node => this.node = node}
        >
          <label>{label}</label>
          <input {...commonProps} />
          {this.renderHelperText()}
          {this.renderCancelSymbol()}
          {this.renderCharacterLimit()}
        </div>)
      } else {
        return (
          <div
            className={`${sharedClassNames} error unacknowledged`}
            onClick={this.acknowledgeError}
            ref={node => this.node = node}
          >
            <label>{label}</label>
            <input {...commonProps} />
            {this.renderCancelSymbol()}
            {this.renderErrorText()}
          </div>)
      }
    } else if (inactive) {
      return (
        <div
          className={sharedClassNames}
          onClick={this.activateInput}
          ref={node => this.node = node}
        >
          <label>{label}</label>
          <input {...commonProps} onFocus={this.activateInput} />
          {this.renderHelperText()}
          {this.renderCharacterLimit()}
        </div>)
    } else {
      return (
        <div
          className={sharedClassNames}
          ref={node => this.node = node}
        >
          <label>{label}</label>
          <input {...commonProps} onKeyDown={this.handleTabOrEnter} />
          {this.renderHelperText()}
          {this.renderCancelSymbol()}
          {this.renderCharacterLimit()}
        </div>)
    }
  }

  render() {
    return <div onClick={this.props.onClick}>{this.renderInput()}</div>
  }

}
