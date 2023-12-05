import * as React from 'react';

const preventDefault = (event) => event.preventDefault();

const wrapPrevent = (callback) => {
  return (event) => {
    event.preventDefault();
    callback();
  }
}

class StyleButton extends React.Component {

  constructor(props) {
    super(props);
    this.UNSAFE_componentWillMount = this.UNSAFE_componentWillMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
  }

  // register with store updates to ensure rerender
  UNSAFE_componentWillMount() {
    this.props.bindToState(this);
  }

  componentWillUnmount() {
    this.props.bindToState(this, true);
  }

  render() {
    const { store, inlineStyle, label, children } = this.props;
    const toggleInlineStyle = store.toggleInlineStyle.bind(store, inlineStyle);
    let isActive = undefined;

    if (store.getEditorState) {
      const currentStyle = store.getEditorState().getCurrentInlineStyle();
      isActive = currentStyle.has(inlineStyle);
    } else {
      // editor not yet available / initialized
      isActive = false;
    }

    if (children && typeof children == 'object') {
      const ChildInput = React.cloneElement(children, {
        toggleInlineStyle: wrapPrevent(toggleInlineStyle),
        isActive,
        label,
        inlineStyle,
        onMouseDown: preventDefault
      });

      return ChildInput;
    }

    const spanStyle = {
      color: isActive ? '#900' : '#999',
      cursor: 'pointer',
      display: 'inline-block',
      marginRight: '1em'
    }

    return (
      <span
        onClick={wrapPrevent(toggleInlineStyle)}
        onMouseDown={preventDefault}
        style={spanStyle}
      >
        {label}
      </span>
    );
  }
}

export default StyleButton;
