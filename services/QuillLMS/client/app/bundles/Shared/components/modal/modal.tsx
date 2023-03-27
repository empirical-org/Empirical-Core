import * as React from 'react';

const Modal = (props: any) => (
  <div className="modal is-active">
    <div className="modal-background" />
    <div className="modal-container">
      <div className="modal-content">
        {props.children}
      </div>
    </div>
    <button className="modal-close" onClick={props.close} />
  </div>
)

export { Modal };

