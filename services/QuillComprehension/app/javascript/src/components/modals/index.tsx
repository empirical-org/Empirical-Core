import React from 'react';
import ReactDOM from 'react-dom'


class Modal extends React.Component<any> {

  constructor(props) {
    super(props);
  }

  render() {
    return ReactDOM.createPortal(
      (<div className="modal">{this.props.children}</div>),
      document.getElementById('modal-root'),
    );
  }
}

export default Modal