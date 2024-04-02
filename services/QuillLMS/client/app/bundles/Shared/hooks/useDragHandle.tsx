import * as React from 'react'

const DragHandleContext = React.createContext();

// Context Provider component
export const DragHandleProvider = ({ children, attributes, listeners }) => {
  return (
    <DragHandleContext.Provider value={{ attributes, listeners }}>
      {children}
    </DragHandleContext.Provider>
  );
};

// Hook to use context
const useDragHandle = () => React.useContext(DragHandleContext);

export default useDragHandle
