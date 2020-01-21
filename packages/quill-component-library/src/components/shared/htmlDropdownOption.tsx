import React from 'react'
import { components } from 'react-select';

export class HTMLDropdownOption extends React.StatelessComponent {
  handleMouseEnter = () => {
    const { options, selectProps, data, } = this.props
    const index = options.findIndex(opt => opt.value === data.value)
    selectProps.updateCursor(index)
  }

  render() {
    const { label, selectProps, options, data, } = this.props
    const passedProps = {...this.props}
    passedProps.isFocused = options[selectProps.cursor] === data
    return (
      <div className="html-dropdown-option" onMouseEnter={this.handleMouseEnter}>
        <components.Option {...this.props}>
          <div dangerouslySetInnerHTML={{ __html: label }} />
        </components.Option>
      </div>
    );
  }
};
