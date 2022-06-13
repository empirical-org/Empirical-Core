import * as React from 'react'

interface NumberFilterInputProps {
  handleChange: Function;
  label: string;
  column: {
    filterValue: string;
    id: string;
  }
}

export const NumberFilterInput: React<NumberFilterInputProps> = ({ handleChange, label, column }) => {
  return (
    <div style={{ display: 'flex' }}>
      <input
        aria-label={label}
        defaultValue={column.filterValue || ''}
        onChange={e => handleChange(column.id, e.target.value)}
        placeholder={`0-5, >1, <1`}
        style={{width: '100px', marginRight: '0.5rem'}}
        type="text"
      />
    </div>
  );
}
