import React from 'react';
import Select from 'react-select';
import { HTMLDropdownOption } from './htmlDropdownOption'
import { HTMLDropdownSingleValue } from './htmlDropdownSingleValue'
import { CheckableDropdownOption } from './checkableDropdownOption'
import { CheckableDropdownValueContainer } from './checkableDropdownValueContainer'

interface DropdownInputProps {
  options: Array<any>;
  className?: string;
  disabled?: boolean;
  error?: string;
  handleCancel?: (event: any) => void;
  handleChange?: (event: any) => void;
  helperText?: string;
  label?: string;
  id?: string;
  isMulti?: boolean;
  isSearchable?: boolean;
  onClick?: (event: any) => void;
  optionType?: string;
  placeholder?: string;
  timesSubmitted?: Number;
  type?: string;
  usesCustomOption?: boolean;
  value?: string;
}

interface DropdownInputState {
  inactive: boolean;
  errorAcknowledged: boolean;
  menuIsOpen: boolean;
  cursor?: number;
}

export class DropdownInput extends React.Component<DropdownInputProps, DropdownInputState> {
  private input: any // eslint-disable-line react/sort-comp
  private node: any // eslint-disable-line react/sort-comp

  constructor(props) {
    super(props)

    this.state = {
      inactive: true,
      errorAcknowledged: false,
      menuIsOpen: false,
    }
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick, true)
    document.addEventListener('keydown', this.handleKeyDown, true)
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
    document.removeEventListener('mousedown', this.handleClick, true)
  }

  handleInputActivation = () => {
    const { disabled, } = this.props
    const { inactive, menuIsOpen, } = this.state
    if (!disabled && (!menuIsOpen || inactive)) {
      this.setState({ inactive: false, menuIsOpen: true, cursor: 0 }, () => this.input ? this.input.focus() : null)
    }
  }

  deactivateInput = () => {
    this.setState({ inactive: true, menuIsOpen: false, cursor: null })
  }

  handleClick = (e) => {
    if (this.node && !this.node.contains(e.target)) {
      this.deactivateInput()
    }
  }

  updateCursor = (cursor) => {
    this.setState({ cursor: cursor })
  }

  onKeyDown = (event) => {
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

  handleKeyDown = (e) => {
    const { options, } = this.props
    const { inactive, menuIsOpen, cursor, } = this.state

    if (!['Enter', 'ArrowUp', 'ArrowDown'].includes(e.key)) { return }
    if (!(this.node && this.node.contains(e.target))) { return }

    if (e.key === 'Enter' && (inactive || !menuIsOpen)) {
      this.handleInputActivation()
    } else if (e.key === 'ArrowUp' && cursor > 0) {
      this.setState(prevState => ({ cursor: prevState.cursor - 1 }))
    } else if (e.keyCode === 'ArrowDown' && cursor < options.length - 1) {
      this.setState(prevState => ({ cursor: prevState.cursor + 1 }))
    } else if (e.key === 'Enter' && (cursor || cursor === 0)) {
      const chosenOption = options[cursor]
      this.handleOptionSelection(chosenOption)
    }
  }

  handleErrorAcknowledgement = () => {
    this.setState({ errorAcknowledged: true, inactive: false, }, () => this.input ? this.input.focus() : null)
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

  handleOptionSelection = (e) => {
    const { handleChange, value, options, isMulti, } = this.props
    const allWasClicked = Array.isArray(e) && e.find(opt => opt.value === 'All')

    if (!isMulti) { this.deactivateInput() }

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
    const { inactive, errorAcknowledged, menuIsOpen, cursor, } = this.state
    const { className, label, value, placeholder, error, type, id, options, isSearchable, isMulti, optionType, usesCustomOption, } = this.props
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
      cursor,
      ref: (input) => { this.input = input; },
      value: passedValue,
      type,
      placeholder: placeholder || '',
      onKeyDown: this.onKeyDown,
      options: passedOptions,
      isClearable: false,
      className: "dropdown",
      classNamePrefix: "dropdown",
      isSearchable,
      updateCursor: this.updateCursor
    }
    if (error) {
      if (errorAcknowledged) {
        return (
          <div
            className={`error ${sharedClasses}`}
            onClick={this.handleInputActivation}
            ref={node => this.node = node}
            tabIndex={0}
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
            onClick={this.handleErrorAcknowledgement}
            ref={node => this.node = node}
            tabIndex={0}
          >
            <label>{label}</label>
            <Select
              {...sharedProps}
              menuIsOpen={false}
              onFocus={this.handleInputActivation}
            />
            {this.renderErrorText()}
          </div>)
      }
    } else if (isMulti) {
      return (<div
        className={sharedClasses}
        onClick={this.handleInputActivation}
        ref={node => this.node = node}
        tabIndex={0}
      >
        <label>{label}</label>
        <Select
          {...sharedProps}
          closeMenuOnSelect={false}
          components={{ Option: CheckableDropdownOption, ValueContainer: CheckableDropdownValueContainer }}
          hideSelectedOptions={false}
          isMulti
          isSearchable={false}
          menuIsOpen={inactive ? false : menuIsOpen}
          onChange={this.handleOptionSelection}
          optionType={optionType}
        />
      </div>)
    } else if (usesCustomOption) {
      return (
        <div
          className={sharedClasses}
          onClick={this.handleInputActivation}
          ref={node => this.node = node}
          tabIndex={0}
        >
          <label>{label}</label>
          <Select
            {...sharedProps}
            components={{ SingleValue: HTMLDropdownSingleValue, Option: HTMLDropdownOption }}
            hideSelectedOptions={false}
            menuIsOpen={inactive ? false : menuIsOpen}
            onChange={this.handleOptionSelection}
          />
        </div>)
    } else if (inactive) {
      return (
        <div
          className={`${sharedClasses}`}
          onClick={this.handleInputActivation}
          ref={node => this.node = node}
          tabIndex={0}
        >
          <label>{label}</label>
          <Select
            {...sharedProps}
            menuIsOpen={false}
            onFocus={this.handleInputActivation}
          />
          {this.renderHelperText()}
        </div>
      )
    } else {
      return (
        <div
          className={`dropdown ${sharedClasses}`}
          ref={node => this.node = node}
          tabIndex={0}
        >
          <label>{label}</label>
          <Select
            {...sharedProps}
            menuIsOpen={menuIsOpen}
            onChange={this.handleOptionSelection}
          />
        </div>
      )
    }
  }

  render() {
    const { onClick, } = this.props
    return <div onClick={onClick}>{this.renderInput()}</div>
  }
}
