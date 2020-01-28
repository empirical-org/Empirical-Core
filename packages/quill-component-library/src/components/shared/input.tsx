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
  onClick?: () => void;
  characterLimit?: number;
}

interface InputState {
  inactive: boolean;
  errorAcknowledged: boolean;
}

const MOUSEDOWN = 'mousedown'

export class Input extends React.Component<InputProps, InputState> {
  private input: any // eslint-disable-line react/sort-comp
  private node: any // eslint-disable-line react/sort-comp

  constructor(props) {
    super(props)

    this.state = {
      inactive: true,
      errorAcknowledged: false
    }
  }

  componentDidMount() {
    document.addEventListener(MOUSEDOWN, this.handleClick, false)
  }

  componentWillReceiveProps(nextProps) {
    const { error, timesSubmitted, } = this.props
    const { errorAcknowledged, } = this.state
    if (nextProps.error !== error && errorAcknowledged) {
      this.setState({ errorAcknowledged: false, })
    } else if (nextProps.timesSubmitted !== timesSubmitted && nextProps.error && errorAcknowledged) {
      this.setState({ errorAcknowledged: false, })
    }
  }

  componentWillUnmount() {
    document.removeEventListener(MOUSEDOWN, this.handleClick, false)
  }

  handleInputContainerClick = () => {
    const { onClick, disabled, } = this.props
    if (onClick) { onClick() }
    if (!disabled) {
      this.setState({ inactive: false, }, () => this.input.focus())
    }
  }

  handleKeyDownOnInputContainer = (e) => {
    if (e.key !== 'Enter') { return }

    this.handleInputContainerClick()
  }

  deactivateInput = () => {
    this.setState({ inactive: true, }, () => this.input.blur())
  }

  handleClick(e) {
    if (!this.node.contains(e.target)) {
      this.deactivateInput()
    }
  }

  handleClickOnUnacknowledgedError = () => {
    this.setState({ errorAcknowledged: true, inactive: false, }, () => this.input.focus())
  }

  handleKeyDownOnUnacknowledgedError = (e) => {
    if (e.key !== 'Enter') { return }

    this.handleClickOnUnacknowledgedError()
  }

  handleTabOrEnter = (event) => {
    if (event.key === 'Enter' || event.key === 'Tab') {
      this.deactivateInput()
    }
  }

  renderHelperText = () => {
    const { helperText } = this.props
    if (helperText) {
      return <span className="helper-text">{helperText}</span>
    }
  }

  renderErrorText = () => {
    const { error } = this.props
    if (error) {
      return <span className="error-text">{error}</span>
    }
  }

  renderCancelSymbol = () => {
    const { inactive } = this.state
    const { handleCancel } = this.props
    if (!inactive && handleCancel) {
      return <button aria-label="X" className="cancel" onClick={handleCancel} type="button"><i className="fas fa-times" /></button>
    }
  }

  renderCharacterLimit = () => {
    const { characterLimit, value, } = this.props
    if (characterLimit) {
      return <div className="character-limit"><span>{value.length}/{characterLimit}</span></div>
    }
  }

  renderInput = () => {
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
          onClick={this.handleInputContainerClick}
          onKeyDown={this.handleKeyDownOnInputContainer}
          ref={node => this.node = node}
          role="button"
          tabIndex={-1}
        >
          <label htmlFor={id}>{label}</label>
          <input {...commonProps} />
          {this.renderHelperText()}
          {this.renderCancelSymbol()}
          {this.renderCharacterLimit()}
        </div>)
      } else {
        return (
          <div
            className={`${sharedClassNames} error unacknowledged`}
            onClick={this.handleClickOnUnacknowledgedError}
            onKeyDown={this.handleKeyDownOnUnacknowledgedError}
            ref={node => this.node = node}
            role="button"
            tabIndex={0}
          >
            <label htmlFor={id}>{label}</label>
            <input {...commonProps} />
            {this.renderCancelSymbol()}
            {this.renderErrorText()}
          </div>)
      }
    } else if (inactive) {
      return (
        <div
          className={sharedClassNames}
          onClick={this.handleInputContainerClick}
          onKeyDown={this.handleKeyDownOnInputContainer}
          ref={node => this.node = node}
          role="button"
          tabIndex={-1}
        >
          <label htmlFor={id}>{label}</label>
          <input {...commonProps} onFocus={this.handleInputContainerClick} />
          {this.renderHelperText()}
          {this.renderCharacterLimit()}
        </div>)
    } else {
      return (
        <div
          className={sharedClassNames}
          ref={node => this.node = node}
        >
          <label htmlFor={id}>{label}</label>
          <input {...commonProps} onKeyDown={this.handleTabOrEnter} />
          {this.renderHelperText()}
          {this.renderCancelSymbol()}
          {this.renderCharacterLimit()}
        </div>)
    }
  }

  render() {
    return this.renderInput()
  }

}
