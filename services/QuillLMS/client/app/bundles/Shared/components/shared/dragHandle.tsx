import * as React from 'react'

import useDragHandle from '../../hooks/useDragHandle';

export const DragHandle = ({ children }) => {
  const { attributes, listeners } = useDragHandle();

  return (
    <div {...attributes} {...listeners}>
      {children}
    </div>
  );
};
