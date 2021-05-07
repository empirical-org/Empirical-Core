"use strict";
import React from 'react'

interface NumberFilterInputProps {
  handleChange: Function;
  label: string;
  filter: {
    value: string;
  }
}

interface NumberFilterInputState {
}

export default class NumberFilterInput extends React.Component<NumberFilterInputProps, NumberFilterInputState> {
  render() {
    const { handleChange, label, filter } = this.props
		return (
  <div style={{ display: 'flex' }}>
    <input
      aria-label={label}
      defaultValue={filter ? filter.value : ''}
      onChange={e => handleChange(e.target.value)}
      placeholder={`0-5, >1, <1`}
      style={{width: '100px', marginRight: '0.5rem'}}
      type="text"
    />
  </div>
		);
	}
}
