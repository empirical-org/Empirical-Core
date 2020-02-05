import * as React from 'react'

const avatarSrc = `${process.env.CDN_URL}/images/icons/avatar.svg`

interface StudentNavbarDropdownProps {
  name: string;
}

interface StudentNavbarDropdownState {
  isOpen: boolean;
}

const MAXIMUM_NAME_LENGTH = 27
const ENTER = 'Enter'
const TAB = 'Tab'
const MOUSEDOWN = 'mousedown'
const KEYDOWN = 'keydown'

export default class StudentNavbarDropdown extends React.Component<StudentNavbarDropdownProps, StudentNavbarDropdownState> {
  private dropdownContainer: any // eslint-disable-line react/sort-comp

  constructor(props) {
    super(props)

    this.state = {
      isOpen: false
    }
  }

  componentDidMount() {
    document.addEventListener(MOUSEDOWN, this.handleClickOutsideDropdown, false)
    document.addEventListener(KEYDOWN, this.handleTab, false)
  }

  dropdownContainerRef = (node) => this.dropdownContainer = node

  handleClickOutsideDropdown = (e) => {
    if (this.dropdownContainer && !this.dropdownContainer.contains(e.target)) {
      this.setState({ isOpen: false, })
    }
  }

  handleTab = (e) => {
    if (e.key !== TAB) { return }
    this.setState({ isOpen: false, })
  }

  handleNameClick = () => {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }))
  }

  handleEnterOnName = (e) => {
    if (e.key !== ENTER) { return }

    this.handleNameClick()
  }

  renderDropdown() {
    const { isOpen, } = this.state

    if (!isOpen) { return }

    return (<div className="dropdown-menu">
      <a href="/account_settings">Settings</a>
      <a href="/session">Logout</a>
    </div>)
  }

  render() {
    const { name, } = this.props
    const displayedName = name.length > MAXIMUM_NAME_LENGTH ? `${name.substring(0, MAXIMUM_NAME_LENGTH)}...`: name
    return (<div className="student-navbar-dropdown student-navbar-item" ref={this.dropdownContainerRef}>
      <button className="focus-on-dark" id="name-container" onClick={this.handleNameClick} onKeyDown={this.handleEnterOnName} type="button">
        <img alt="Avatar icon" src={avatarSrc} />
        <span>{displayedName}</span>
        <div aria-label="Dropdown icon" className="dropdown-indicator" />
      </button>
      {this.renderDropdown()}
    </div>)
  }
}
