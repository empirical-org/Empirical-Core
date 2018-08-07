import React from 'react';

const AffectedResponse = (props: any) =>
  (<div className="affected-response" style={{border: 'red 1px solid'}}>
    {props.children}
  </div>);

export { AffectedResponse };
