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

  handleSkipToMainContentClick = () => {
    const element = document.getElementById("main-content")
    element.focus()
    element.scrollIntoView()
  }

  render() {
    const { children, } = this.props
    const { showFocusState, } = this.state
    const className = showFocusState ? '' : 'hide-focus-outline'
    return (
      <div className={className}>
        <button className="skip-main" onClick={this.handleSkipToMainContentClick} type="button">Skip to main content</button>
        <NavBar />
        <div id="main-content" tabIndex={-1}>{children}</div>
      </div>
    );
  }
};
