import * as React from 'react';

export interface DeleteButtonProps {
  questionId: string,
  onChange(questionId: string): void
}

export interface NameInputProps {
  name: string,
  onChange(value: string, e: object): void
}

export const DeleteButton = ({ questionId, onChange }: DeleteButtonProps) => {
  function handleClick() { onChange(questionId) }
  return <button onClick={handleClick} type="button">Delete</button>;
}

export const NameInput = ({ name, onChange }: NameInputProps) => {
  function handleChange(e: object) { onChange('name', e) };
  return(
    <label className="label" htmlFor="activity-name-input">
      Name
      <input
        aria-label="activity-name-input"
        className="input"
        id="activity-name-input"
        onChange={handleChange}
        placeholder="Text input"
        type="text"
        value={name}
      />
    </label>
  );
}
