import React from 'react';
import NavBar from './navbar/studentNavbar';

export default class StudentRoot extends React.Component {
  constructor(props) {
    super(props)

    this.state = { showFocusState: false }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)
  }

  handleKeyDown = (e) => {
    if (e.key !== 'Tab') { return }

    const { showFocusState, } = this.state

    if (showFocusState) { return }

    this.setState({ showFocusState: true })
  }

  render() {
    const { children, } = this.props
    const { showFocusState, } = this.state
    const className = showFocusState ? '' : 'hide-focus-outline'
    return (
      <div className={className}>
        <NavBar />
        {children}
      </div>
    );
  }
};
