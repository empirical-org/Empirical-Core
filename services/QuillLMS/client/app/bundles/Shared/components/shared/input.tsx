import * as React from 'react';

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
  showPlaceholderWhenInactive?: boolean;
  autoComplete: string;
}

interface InputState {
  inactive: boolean;
  errorAcknowledged: boolean;
}

const MOUSEDOWN = 'mousedown'
const ENTER = 'Enter'
const TAB = 'Tab'

export class Input extends React.Component<InputProps, InputState> {
  // disabling the react/sort-comp rule for the following lines because as of 2/5/20, the linter incorrectly insists that static and private instance variables be placed under the constructor, when in fact doing so causes errors in compilation
  private input: any // eslint-disable-line react/sort-comp
  private node: any // eslint-disable-line react/sort-comp
  static defaultProps: { autoComplete: string }  // eslint-disable-line react/sort-comp

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

    const newError = nextProps.error !== error && errorAcknowledged
    const newSubmissionWithSameError = nextProps.timesSubmitted !== timesSubmitted && nextProps.error && errorAcknowledged

    if (!newError && !newSubmissionWithSameError) { return }

    this.setState({ errorAcknowledged: false, })
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
    if (e.key !== ENTER) { return }

    this.handleInputContainerClick()
  }

  deactivateInput = () => {
    this.setState({ inactive: true, }, () => {
      // performing the blur on Safari causes tab navigation to skip the rest of the inputs on the page
      if (!(navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0)) {
        this.input.blur()
      }
    })
  }

  handleClick = (e) => {
    if (!this.node || !this.node.contains(e.target)) {
      this.deactivateInput()
    }
  }

  handleClickOnUnacknowledgedError = () => {
    this.setState({ errorAcknowledged: true, inactive: false, }, () => this.input.focus())
  }

  handleKeyDownOnUnacknowledgedError = (e) => {
    this.handleClickOnUnacknowledgedError()
  }

  handleTab = (event) => {
    if (event.key === TAB) {
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
      return <span className="error-text" role="alert">{error}</span>
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
    const { className, label, handleChange, value, placeholder, error, type, id, disabled, characterLimit, autoComplete, showPlaceholderWhenInactive, } = this.props
    const inactiveOrActive = inactive ? 'inactive' : 'active'
    const hasText = value ? 'has-text' : ''
    const hasCharacterLimit = characterLimit ? 'has-character-limit' : ''
    const sharedClassNames = `input-container  ${inactiveOrActive} ${hasText} ${className} ${hasCharacterLimit}`
    const commonProps = {
      id,
      ref: (input) => { this.input = input; },
      onChange: handleChange,
      value,
      type,
      placeholder: (!inactive || showPlaceholderWhenInactive) && placeholder,
      disabled,
      maxLength: characterLimit ? characterLimit : 10000,
      autoComplete
    }
    if (error) {
      if (errorAcknowledged) {
        return (
          <div
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
          </div>
        )
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
          </div>
        )
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
        </div>
      )
    } else {
      return (
        <div
          className={sharedClassNames}
          ref={node => this.node = node}
        >
          <label htmlFor={id}>{label}</label>
          <input {...commonProps} onKeyDown={this.handleTab} />
          {this.renderHelperText()}
          {this.renderCancelSymbol()}
          {this.renderCharacterLimit()}
        </div>
      )
    }
  }

  render() {
    return this.renderInput()
  }
}

Input.defaultProps = {
  autoComplete: 'on'
}
