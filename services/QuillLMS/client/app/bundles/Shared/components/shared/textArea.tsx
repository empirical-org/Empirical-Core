import * as React from 'react';

interface InputProps {
  timesSubmitted: Number;
  label: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  value?: string;
  placeholder?: string;
  id?: string;
  characterLimit?: number;
  handleCancel?: (event: any) => void;
  helperText?: string;
  handleChange?: (event: any) => void;
  onClick?: (event: any) => void;
}

interface InputState {
  inactive: boolean;
  errorAcknowledged: boolean;
}

export class TextArea extends React.Component<InputProps, InputState> {
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
    this.handleTab = this.handleTab.bind(this)
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

  handleTab(event) {
    if (event.key === 'Tab') {
      const form = event.target.form;
      const index = Array.prototype.indexOf.call(form, event.target);
      form.elements[index + 1].focus();
      event.preventDefault();
      this.deactivateInput()
    }
  }

  renderHelperText() {
    const { helperText } = this.props
    if (helperText) {
      return <span className="helper-text">{helperText}</span>
    }
  }

  renderCharacterLimit() {
    const { characterLimit, value, } = this.props
    if (characterLimit) {
      return <div className="character-limit"><span>{value.length}/{characterLimit}</span></div>
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

  renderInput() {
    const { inactive, errorAcknowledged} = this.state
    const { className, label, handleChange, value, placeholder, error, id, disabled, characterLimit, } = this.props
    const hasText = value ? 'has-text' : ''
    const inactiveOrActive = inactive ? 'inactive' : 'active'
    const sharedClasses = `input-container textfield-container ${hasText} ${inactiveOrActive} ${className}`
    if (error) {
      if (errorAcknowledged) {
        return (
          <div
            className={`error ${sharedClasses}`}
            onClick={this.activateInput}
            ref={node => this.node = node}
          >
            <label>{label}</label>
            <textarea
              disabled={disabled}
              id={id}
              maxLength={characterLimit ? characterLimit : 10000}
              onChange={handleChange}
              placeholder={placeholder}
              ref={(input) => { this.input = input; }}
              value={value}
            />
            {this.renderCancelSymbol()}
            {this.renderCharacterLimit()}
          </div>
        )
      } else {
        return (
          <div
            className={`error unacknowledged ${sharedClasses}`}
            onClick={this.acknowledgeError}
            ref={node => this.node = node}
          >
            <label>{label}</label>
            <textarea
              id={id}
              maxLength={characterLimit ? characterLimit : 10000}
              onChange={handleChange}
              placeholder={placeholder}
              ref={(input) => { this.input = input; }}
              value={value}
            />
            {this.renderCancelSymbol()}
            {this.renderErrorText()}
            {this.renderCharacterLimit()}
          </div>
        )
      }
    } else if (inactive) {
      return (
        <div
          className={sharedClasses}
          onClick={this.activateInput}
          ref={node => this.node = node}
        >
          <label>{label}</label>
          <textarea
            disabled={disabled}
            id={id}
            maxLength={characterLimit ? characterLimit : 10000}
            onFocus={this.activateInput}
            ref={(input) => { this.input = input; }}
            value={value}
          />
          {this.renderHelperText()}
          {this.renderCharacterLimit()}
        </div>
      )
    } else {
      return (
        <div
          className={sharedClasses}
          ref={node => this.node = node}
        >
          <label>{label}</label>
          <textarea
            id={id}
            maxLength={characterLimit ? characterLimit : 10000}
            onChange={handleChange}
            onKeyDown={this.handleTab}
            placeholder={placeholder}
            ref={(input) => { this.input = input; }}
            value={value}
          />
          {this.renderCancelSymbol()}
          {this.renderCharacterLimit()}
        </div>
      )
    }
  }

  render() {
    return <div onClick={this.props.onClick}>{this.renderInput()}</div>
  }

}
