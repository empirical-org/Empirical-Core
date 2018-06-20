import React from 'react';
import ReactDOM from 'react-dom'


class Modal extends React.Component<any> {

  constructor(props) {
    super(props);
    this.exit = this.exit.bind(this)
  }

  exit(e) {
    this.props.exit()
  }

  render() {
    return ReactDOM.createPortal(
      (
        <div className="modal" onClick={this.exit}>
            {this.props.children}
        </div>),
      document.getElementById('modal-root'),
    );
  }
}

export default Modal