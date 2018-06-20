import React from 'react';
import ReactDOM from 'react-dom'
const modalRoot = document.getElementById('modal-root');

class Modal extends React.Component<any> {
  static el = document.createElement('div');

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // The portal element is inserted in the DOM tree after
    // the Modal's children are mounted, meaning that children
    // will be mounted on a detached DOM node. If a child
    // component requires to be attached to the DOM tree
    // immediately when mounted, for example to measure a
    // DOM node, or uses 'autoFocus' in a descendant, add
    // state to Modal and only render the children when Modal
    // is inserted in the DOM tree.
    modalRoot.appendChild(Modal.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(Modal.el);
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      Modal.el,
    );
  }
}

export default Modal