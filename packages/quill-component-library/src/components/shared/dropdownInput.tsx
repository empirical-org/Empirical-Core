import React from 'react';
import Select from 'react-select';
import { CheckableDropdownOption } from './checkableDropdownOption'
import { CheckableDropdownValueContainer } from './checkableDropdownValueContainer'

interface DropdownInputProps {
  options: Array<any>;
  label?: string;
  timesSubmitted?: Number;
  id?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  value?: string;
  placeholder?: string;
  type?: string;
  isSearchable?: boolean;
  handleCancel?: (event: any) => void;
  helperText?: string;
  handleChange?: (event: any) => void;
  onClick?: (event: any) => void;
  isMulti?: boolean;
  optionType?: string;
}

interface DropdownInputState {
  inactive: boolean;
  errorAcknowledged: boolean;
  menuIsOpen: boolean;
}

export class DropdownInput extends React.Component<DropdownInputProps, DropdownInputState> {
  private input: any // eslint-disable-line react/sort-comp
  private node: any // eslint-disable-line react/sort-comp

  constructor(props) {
    super(props)

    this.state = {
      inactive: true,
      errorAcknowledged: false,
      menuIsOpen: false
    }

    this.activateInput = this.activateInput.bind(this)
    this.acknowledgeError = this.acknowledgeError.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.deactivateInput = this.deactivateInput.bind(this)
    this.handleOptionSelection = this.handleOptionSelection.bind(this)
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
      this.setState({ inactive: false, menuIsOpen: true }, () => this.input.focus())
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

  onKeyDown(event) {
    if (event.key === 'Tab') {
      const form = event.target.form;
      const index = Array.prototype.indexOf.call(form, event.target);
      form.elements[index + 1].focus();
      event.preventDefault();
      this.deactivateInput()
    } else {
      this.setState({ menuIsOpen: true })
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

  handleOptionSelection(e) {
    const { handleChange, value, options, } = this.props
    this.deactivateInput()
    const allWasClicked = Array.isArray(e) && e.find(opt => opt.value === 'All')
    if (allWasClicked) {
      if (value && value.length) {
        // if there are any selected, they should all get unselected
        handleChange([])
      } else {
        // if there are none selected, they should all get selected
        handleChange(options)
      }
    } else {
      handleChange(e)
    }
  }

  renderInput() {
    const { inactive, errorAcknowledged, menuIsOpen, } = this.state
    const { className, label, value, placeholder, error, type, id, options, isSearchable, isMulti, optionType, } = this.props
    const passedValue = value || ''
    const hasText = value || isMulti ? 'has-text' : ''
    const inactiveOrActive = inactive ? 'inactive' : 'active'
    const notEditable = isSearchable || isMulti ? '' : 'not-editable'
    const checkboxDropdown = isMulti ? 'checkbox-dropdown' : ''
    const sharedClasses = `dropdown-container input-container ${inactiveOrActive} ${hasText} ${notEditable} ${className} ${checkboxDropdown}`
    const showAllOption = isMulti && optionType ? { label: `All ${optionType}s`, value: 'All' } : null
    const passedOptions = showAllOption ? [showAllOption].concat(options) : options
    const sharedProps = {
      id,
      ref: (input) => { this.input = input; },
      value: passedValue,
      type,
      placeholder: placeholder || '',
      onKeyDown: this.onKeyDown,
      options: passedOptions,
      isClearable: false,
      className: "dropdown",
      classNamePrefix: "dropdown",
      isSearchable
    }
    if (error) {
      if (errorAcknowledged) {
        return (
          <div
            className={`error ${sharedClasses}`}
            ref={node => this.node = node}
            onClick={this.activateInput}
          >
            <label>{label}</label>
            <Select
              {...sharedProps}
              menuIsOpen={menuIsOpen}
              onChange={this.handleOptionSelection}
            />
          </div>)
      } else {
        return (
          <div
            className={`error unacknowledged ${sharedClasses}`}
            onClick={this.acknowledgeError}
            ref={node => this.node = node}
          >
            <label>{label}</label>
            <Select
              {...sharedProps}
              onFocus={this.activateInput}
              menuIsOpen={false}
            />
            {this.renderErrorText()}
        </div>)
      }
    } else if (isMulti) {
      return (<div
        className={sharedClasses}
        ref={node => this.node = node}
        onClick={this.activateInput}
      >
        <label>{label}</label>
        <Select
          {...sharedProps}
          onChange={this.handleOptionSelection}
          menuIsOpen={inactive ? false : menuIsOpen}
          isSearchable={false}
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          components={{ Option: CheckableDropdownOption, ValueContainer: CheckableDropdownValueContainer }}
          optionType={optionType}
          isMulti
        />
      </div>)
    } else if (inactive) {
      return (
        <div
          className={`${sharedClasses}`}
          onClick={this.activateInput}
          ref={node => this.node = node}
        >
          <label>{label}</label>
          <Select
            {...sharedProps}
            onFocus={this.activateInput}
            menuIsOpen={false}
          />
          {this.renderHelperText()}
      </div>)
    } else {
      return (
        <div
          className={`dropdown ${sharedClasses}`}
          ref={node => this.node = node}
        >
          <label>{label}</label>
          <Select
            {...sharedProps}
            onChange={this.handleOptionSelection}
            menuIsOpen={menuIsOpen}
          />
      </div>)
    }
  }

  render() {
    return <div onClick={this.props.onClick}>{this.renderInput()}</div>
  }
}
