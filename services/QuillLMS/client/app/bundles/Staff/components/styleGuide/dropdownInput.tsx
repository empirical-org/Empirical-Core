import React from 'react';
import Select, { components } from 'react-select';

interface DropdownInputProps {
  timesSubmitted: Number;
  options: Array<any>;
  label: string;
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
}

interface DropdownInputState {
  inactive: boolean;
  errorAcknowledged: boolean;
  menuIsOpen: boolean;
}

export class DropdownInput extends React.Component<DropdownInputProps, DropdownInputState> {
  private input: any
  private node: any

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
    this.handleChange = this.handleChange.bind(this)
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

  handleChange(e) {
    this.deactivateInput()
    this.props.handleChange(e)
  }

  renderInput() {
    const { inactive, errorAcknowledged, menuIsOpen, } = this.state
    const { className, label, value, placeholder, error, type, id, options, isSearchable, isMulti, } = this.props
    const passedValue = value || ''
    const hasText = value ? 'has-text' : ''
    const inactiveOrActive = inactive ? 'inactive' : 'active'
    const notEditable = isSearchable ? '' : 'not-editable'
    const sharedClasses = `dropdown-container input-container ${inactiveOrActive} ${hasText} ${notEditable} ${className}`
    if (isMulti) {
      const Option = props => {
        return (
          <div>
            <components.Option {...props}>
              <input
                type="checkbox"
                checked={props.isSelected}
                onChange={() => null}
              />{" "}
              <label>{props.label}</label>
            </components.Option>
          </div>
        );
      };

      return (<div
        className={`error ${sharedClasses}`}
        ref={node => this.node = node}
        onClick={this.activateInput}
      >
        <label>{label}</label>
        <Select
          id={id}
          ref={(input) => { this.input = input; }}
          onChange={this.handleChange}
          value={passedValue}
          type={type}
          placeholder={placeholder || ''}
          onKeyDown={this.onKeyDown}
          menuIsOpen={menuIsOpen}
          options={options}
          isClearable={false}
          className="dropdown"
          classNamePrefix="dropdown"
          isSearchable={isSearchable}
          isMulti
        />
      </div>)
    } else if (error) {
      if (errorAcknowledged) {
        return (
          <div
            className={`error ${sharedClasses}`}
            ref={node => this.node = node}
            onClick={this.activateInput}
          >
            <label>{label}</label>
            <Select
              id={id}
              ref={(input) => { this.input = input; }}
              onChange={this.handleChange}
              value={passedValue}
              type={type}
              placeholder={placeholder || ''}
              onKeyDown={this.onKeyDown}
              menuIsOpen={menuIsOpen}
              options={options}
              isClearable={false}
              className="dropdown"
              classNamePrefix="dropdown"
              isSearchable={isSearchable}
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
              id={id}
              ref={(input) => { this.input = input; }}
              onFocus={this.activateInput}
              type={type}
              value={passedValue}
              menuIsOpen={false}
              isClearable={false}
              className="dropdown"
              classNamePrefix="dropdown"
              isSearchable={isSearchable}
            />
            {this.renderErrorText()}
        </div>)
      }
    } else if (inactive) {
      return (
        <div
          className={`${sharedClasses}`}
          onClick={this.activateInput}
          ref={node => this.node = node}
        >
          <label>{label}</label>
          <Select
            id={id}
            ref={(input) => { this.input = input; }}
            onFocus={this.activateInput}
            type={type}
            value={passedValue}
            menuIsOpen={false}
            isClearable={false}
            className="dropdown"
            classNamePrefix="dropdown"
            placeholder={placeholder || ''}
            isSearchable={isSearchable}
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
            id={id}
            ref={(input) => { this.input = input; }}
            onChange={this.handleChange}
            value={passedValue}
            type={type}
            placeholder={placeholder || ''}
            onKeyDown={this.onKeyDown}
            menuIsOpen={menuIsOpen}
            options={options}
            isClearable={false}
            className="dropdown"
            classNamePrefix="dropdown"
            isSearchable={isSearchable}
          />
      </div>)
    }
  }

  render() {
    return <div onClick={this.props.onClick}>{this.renderInput()}</div>
  }
}
