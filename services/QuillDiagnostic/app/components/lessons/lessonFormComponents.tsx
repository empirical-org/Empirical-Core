import * as React from 'react';

export interface DeleteButtonProps {
  questionId: string,
  onHandleChange(questionId: string): void
}

export interface NameInputProps {
  name: string,
  onHandleChange(value: string, e: object): void
}

export const DeleteButton = ({ questionId, onHandleChange }: DeleteButtonProps) => {
  function handleClick() { onHandleChange(questionId) }
  return <button onClick={handleClick} type="button">Delete</button>;
}

export const NameInput = ({ name, onHandleChange }: NameInputProps) => {
  function handleChange(e: object) { onHandleChange('name', e) };
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
