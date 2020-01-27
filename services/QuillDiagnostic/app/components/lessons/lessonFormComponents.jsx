import React from 'react';

export const DeleteButton = ({ questionId, onHandleChange }) => {
  function handleClick() { onHandleChange(questionId) }
  return <button onClick={handleClick} type="button">Delete</button>;
}

export const NameInput = ({ name, onHandleChange }) => {
  function handleChange(e) { onHandleChange('name', e) };
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