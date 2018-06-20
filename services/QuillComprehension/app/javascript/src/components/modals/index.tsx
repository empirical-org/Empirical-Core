import React from 'react';
import ReactDOM from 'react-dom'


class Modal extends React.Component<any> {
  // static el = document.createElement('div');
  // static modalRoot = document.getElementById('modal-root');

  constructor(props) {
    super(props);

    console.log(props.children)
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
    document.getElementById('modal-root').appendChild(document.createElement('div'));
  }

  componentWillUnmount() {
    document.getElementById('modal-root').removeChild(document.createElement('div'));
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      document.getElementById('modal-root'),
    );
  }
}

export default Modal