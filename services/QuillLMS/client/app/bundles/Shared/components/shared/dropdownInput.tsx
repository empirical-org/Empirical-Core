import * as React from 'react';
import Select from 'react-select';

import { HTMLDropdownOption } from './htmlDropdownOption'
import { HTMLDropdownSingleValue } from './htmlDropdownSingleValue'
import { CheckableDropdownOption } from './checkableDropdownOption'
import { CheckableDropdownValueContainer } from './checkableDropdownValueContainer'
import { StandardDropdownOption } from './standardDropdownOption'

interface DropdownInputProps {
  options: Array<{label: string, value: string, [key:string]: any}>;
  className?: string;
  disabled?: boolean;
  error?: string;
  handleCancel?: (event: any) => void;
  handleChange?: (selection: any|any[]) => void;
  helperText?: string;
  label?: string;
  id?: string;
  isMulti?: boolean;
  isSearchable?: boolean;
  onClick?: (event?: any) => void;
  optionType?: string;
  placeholder?: string;
  timesSubmitted?: Number;
  type?: string;
  usesCustomOption?: boolean;
  value?: any;
  filterOptions?: (
    candidate: { label: string; value: string; data: any },
    value: string,
    options: { label: string; value: string }[]
  ) => void;
  handleInputChange?: any
}

interface DropdownInputState {
  active: boolean;
  errorAcknowledged: boolean;
  menuIsOpen: boolean;
  options: Array<any>;
  cursor: number|null;
  inputValue: string;
}

const KEYDOWN = 'keydown'
const MOUSEDOWN = 'mousedown'

const ARROWDOWN = 'ArrowDown'
const ARROWUP = 'ArrowUp'
const TAB = 'Tab'
const ENTER = 'Enter'

export class DropdownInput extends React.Component<DropdownInputProps, DropdownInputState> {
  private input: any // eslint-disable-line react/sort-comp
  private node: any // eslint-disable-line react/sort-comp

  constructor(props) {
    super(props)

    this.state = {
      active: false,
      errorAcknowledged: false,
      menuIsOpen: false,
      options: [],
      cursor: null,
      inputValue: ''
    }
  }

  componentDidMount() {
    this.handleUpdatedOptions(null);
    document.addEventListener(MOUSEDOWN, this.handleClick, true)
    document.addEventListener(KEYDOWN, this.handleKeyDown, true)
  }

  componentDidUpdate(_, prevState) {
    const { cursor, } = this.state

    if (cursor === null || cursor === prevState.cursor) { return }

    this.setOptionFocus()
  }

  componentWillReceiveProps(nextProps: any) {
    const { error, timesSubmitted, options } = this.props
    const { errorAcknowledged, } = this.state
    if (nextProps.error !== error && errorAcknowledged) {
      this.setState({ errorAcknowledged: false, })
    } else if (nextProps.timesSubmitted !== timesSubmitted && nextProps.error && errorAcknowledged) {
      this.setState({ errorAcknowledged: false, })
    } else if (nextProps.options !== options) {
      this.handleUpdatedOptions(nextProps.options);
    }
  }

  componentWillUnmount() {
    document.removeEventListener(MOUSEDOWN, this.handleClick, true)
    document.removeEventListener(KEYDOWN, this.handleClick, true)
  }

  handleUpdatedOptions = (receivedOptions: any) => {
    const { options, isMulti, optionType, } = this.props;
    const opts = receivedOptions ? receivedOptions : options;
    const showAllOption = isMulti && optionType ? { label: `All ${optionType}s`, value: 'All' } : null
    const passedOptions = showAllOption ? [showAllOption].concat(opts) : opts

    this.setState({ options: passedOptions });
  }

  handleInputActivation = () => {
    const { disabled, isSearchable, onClick, } = this.props
    const { active, menuIsOpen, } = this.state

    if (onClick) { onClick() }

    if (!disabled && (!menuIsOpen || !active)) {
      const cursor = isSearchable ? null : 0
      this.setState({ active: true, menuIsOpen: true, cursor }, () => { this.input ? this.input.focus() : null })
    }
  }

  setOptionFocus = () => {
    const { cursor, options, } = this.state

    const optionToFocus = options[cursor]
    const elementToFocus = optionToFocus ? document.getElementById(optionToFocus.value) : null
    elementToFocus ? elementToFocus.focus() : null
  }

  deactivateInput = () => {
    this.setState({ active: false, menuIsOpen: false, cursor: null, inputValue: '' })
  }

  filteredOptions = () => {
    const { options, inputValue, } = this.state

    if (!inputValue.length) { return options }

    const inputValueRegex = new RegExp(inputValue, 'i')

    return options.filter(opt => opt.label.match(inputValueRegex))
  }

  handleClick = (e) => {
    if (!this.node || !this.node.contains(e.target)) {
      this.deactivateInput()
    }
  }

  handleInputChange = (inputValue, action) => {
    const { handleInputChange } = this.props;
    if (action.action !== "input-blur" && action.action !== 'menu-close') {
      this.setState({ inputValue });
    }
    if(handleInputChange && action.action === 'input-change') {
      handleInputChange(inputValue);
    }
  }

  updateCursor = (cursor) => {
    this.setState({ cursor: cursor })
  }

  handleErrorAcknowledgement = () => {
    this.setState({ errorAcknowledged: true, active: true, menuIsOpen: true, }, () => this.input ? this.input.focus() : null)
  }

  onKeyDown = (event) => {
    if (event.key === TAB) {
      this.deactivateInput()
    }
  }

  updateFocusedOption = () => {
    const { cursor, } = this.state
    const options = this.filteredOptions()
    const focusedOption = options[cursor]

    document.getElementById(focusedOption.value).focus()
  }

  handleKeyDown = (e) => {
    const { active, menuIsOpen, cursor, } = this.state

    const inactiveNode = !(this.node && this.node.contains(e.target))
    const keyWasNotTab = e.key !== TAB

    if (inactiveNode && keyWasNotTab) { return }

    const options = this.filteredOptions()

    switch (e.key) {
      case ARROWDOWN:
        if (cursor < options.length - 1) {
          this.setState(prevState => {
            if (prevState.cursor !== null) {
              return { cursor: prevState.cursor + 1 }
            }
            return { cursor: 0 }
          }, this.updateFocusedOption)
        } else if (cursor === null && options.length === 1) {
          this.setState({ cursor: 0 }, this.updateFocusedOption)
        } else {
          this.updateFocusedOption()
        }
        break
      case ARROWUP:
        this.setState(prevState => ({ cursor: Math.max(prevState.cursor - 1, 0) }), this.updateFocusedOption)
        break
      case TAB:
        this.deactivateInput()
        break
      case ENTER:
        e.preventDefault()
        if (!active || !menuIsOpen) {
          this.handleInputActivation()
        } else if (cursor !== null) {
          this.handleEnterWithFocusedOption()
        }
        break

      default:
        break
    }
  }

  handleEnterWithFocusedOption = () => {
    const { cursor, } = this.state
    const { value, isMulti, } = this.props

    const options = this.filteredOptions()
    const focusedOption = options[cursor]

    if (isMulti && Array.isArray(value)) {
      const valueWasPreviouslySelected = value.find(opt => opt.value === focusedOption.value)
      const newArray = valueWasPreviouslySelected ? value.filter(opt => opt.value !== focusedOption.value) : value.concat(focusedOption)
      this.handleOptionSelection(newArray)
    } else {
      this.handleOptionSelection(focusedOption)
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

  handleOptionSelection = (selection) => {
    const { handleChange, value, isMulti, options, } = this.props
    const allWasClicked = Array.isArray(selection) && selection.find(opt => opt.value === 'All')

    if (allWasClicked) {
      if (value && value.length) {
        // if there are any selected, they should all get unselected
        handleChange([])
      } else {
        // if there are none selected, they should all get selected
        handleChange(options)
      }
    } else {
      handleChange(selection)
    }

    if (!isMulti) { this.deactivateInput() }
  }

  handleKeyDownOnInputContainer = (e) => {
    if (e.key === TAB) { return }
    this.handleInputActivation()
  }

  handleFilterOptions = (candidate: { label: string; value: string; data: any }, value: string) => {
    const { filterOptions, options } = this.props;
    return filterOptions(candidate, value, options)
  }

  renderInput() {
    const { active, errorAcknowledged, menuIsOpen, cursor, inputValue, options } = this.state
    const { className, label, value, placeholder, error, type, id, isSearchable, isMulti, optionType, usesCustomOption, filterOptions } = this.props
    const passedValue = value || ''
    const hasText = value || isMulti ? 'has-text' : ''
    const inactiveOrActive = active ? 'active' : 'inactive'
    const notEditable = isSearchable || isMulti ? '' : 'not-editable'
    const checkboxDropdown = isMulti ? 'checkbox-dropdown' : ''
    const sharedClasses = `dropdown-container input-container ${inactiveOrActive} ${hasText} ${notEditable} ${className} ${checkboxDropdown}`
    const sharedProps = {
      id,
      cursor,
      ref: (input) => { this.input = input; },
      value: passedValue,
      type,
      placeholder: placeholder || '',
      onKeyDown: this.onKeyDown,
      options,
      isClearable: false,
      className: "dropdown",
      classNamePrefix: "dropdown",
      isSearchable,
      updateCursor: this.updateCursor,
      components: { Option: StandardDropdownOption },
      onInputChange: this.handleInputChange,
      tabIndex: isSearchable ? 0 : -1,
      inputValue,
      filterOption: filterOptions ? this.handleFilterOptions : null
    }
    if (error) {
      if (errorAcknowledged) {
        return (
          <div
            className={`error ${sharedClasses}`}
            onClick={this.handleInputActivation}
            onKeyDown={this.handleKeyDownOnInputContainer}
            ref={node => this.node = node}
            role="button"
            tabIndex={0}
          >
            <label htmlFor={id}>{label}</label>
            <Select
              {...sharedProps}
              menuIsOpen={menuIsOpen}
              onChange={this.handleOptionSelection}
            />
          </div>
        )
      } else {
        return (
          <div
            className={`error unacknowledged ${sharedClasses}`}
            onClick={this.handleErrorAcknowledgement}
            onKeyDown={this.handleErrorAcknowledgement}
            ref={node => this.node = node}
            role="button"
            tabIndex={0}
          >
            <label htmlFor={id}>{label}</label>
            <Select
              {...sharedProps}
              menuIsOpen={false}
            />
            {this.renderErrorText()}
          </div>
        )
      }
    } else if (isMulti) {
      return (
        <div
          className={sharedClasses}
          onClick={this.handleInputActivation}
          onKeyDown={this.handleKeyDownOnInputContainer}
          ref={node => this.node = node}
          role="button"
          tabIndex={0}
        >
          <label htmlFor={id}>{label}</label>
          <Select
            {...sharedProps}
            closeMenuOnSelect={false}
            components={{ Option: CheckableDropdownOption, ValueContainer: CheckableDropdownValueContainer }}
            hideSelectedOptions={false}
            isMulti
            isSearchable={false}
            menuIsOpen={active ? menuIsOpen : false}
            onChange={this.handleOptionSelection}
            optionType={optionType}
          />
        </div>
      )
    } else if (usesCustomOption) {
      return (
        <div
          className={sharedClasses}
          onClick={this.handleInputActivation}
          onKeyDown={this.handleKeyDownOnInputContainer}
          ref={node => this.node = node}
          role="button"
          tabIndex={0}
        >
          <label htmlFor={id}>{label}</label>
          <Select
            {...sharedProps}
            components={{ SingleValue: HTMLDropdownSingleValue, Option: HTMLDropdownOption }}
            hideSelectedOptions={false}
            menuIsOpen={active ? menuIsOpen : false}
            onChange={this.handleOptionSelection}
          />
        </div>
      )
    } else if (!active) {
      return (
        <div
          className={`${sharedClasses}`}
          onClick={this.handleInputActivation}
          onKeyDown={this.handleKeyDownOnInputContainer}
          ref={node => this.node = node}
          role="button"
          tabIndex={0}
        >
          <label htmlFor={id}>{label}</label>
          <Select
            {...sharedProps}
            menuIsOpen={false}
          />
          {this.renderHelperText()}
        </div>
      )
    } else {
      return (
        <div
          className={`dropdown ${sharedClasses}`}
          onClick={this.handleInputActivation}
          onKeyDown={this.handleKeyDownOnInputContainer}
          ref={node => this.node = node}
          role="button"
          tabIndex={0}
        >
          <label htmlFor={id}>{label}</label>
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
    return this.renderInput()
  }
}
