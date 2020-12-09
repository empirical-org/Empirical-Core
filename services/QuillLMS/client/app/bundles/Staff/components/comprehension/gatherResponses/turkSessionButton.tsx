import * as React from "react";

export const TurkSessionButton = ({ id, value, label, clickHandler }: { id: number, value?: string, label: string, clickHandler: (e?: any) => void }) => {
  return(
    <button
      className="quill-button fun primary contained"
      id={`${id}`}
      onClick={clickHandler}
      type="submit"
      value={value}
    >
      {label}
    </button>
  )
}

export default TurkSessionButton
