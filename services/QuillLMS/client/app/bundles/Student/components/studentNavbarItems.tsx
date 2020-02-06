import * as React from 'react'

const avatarSrc = `${process.env.CDN_URL}/images/icons/avatar.svg`

interface StudentNavbarItemsProps {
  name: string;
}

interface StudentNavbarItemsState {
  isOpen: boolean;
  cursor: null|number;
}

const MAXIMUM_NAME_LENGTH = 27
const TAB = 'Tab'
const ARROWDOWN = 'ArrowDown'
const ARROWUP = 'ArrowUp'
const MOUSEDOWN = 'mousedown'
const KEYDOWN = 'keydown'

const links = [
  <a href="/account_settings" id="settings-link" key="settings-link">Settings</a>,
  <a href="/session" id="logout-link" key="logout-link">Logout</a>
]

export default class StudentNavbarItems extends React.Component<StudentNavbarItemsProps, StudentNavbarItemsState> {
  private dropdownContainer: any // eslint-disable-line react/sort-comp

  constructor(props) {
    super(props)

    this.state = {
      isOpen: false,
      cursor: null
    }
  }

  componentDidMount() {
    document.addEventListener(MOUSEDOWN, this.handleClickOutsideDropdown, false)
    document.addEventListener(KEYDOWN, this.handleKeyDown, false)
  }

  componentWillUnmount() {
    document.removeEventListener(MOUSEDOWN, this.handleClickOutsideDropdown, false)
    document.removeEventListener(KEYDOWN, this.handleKeyDown, false)
  }

  updateFocusedLink = () => {
    const { cursor, } = this.state
    const focusedLink = links[cursor]

    const element = document.getElementById(focusedLink.key)
    element.focus()
  }

  dropdownContainerRef = (node) => this.dropdownContainer = node

  handleClickOutsideDropdown = (e) => {
    if (this.dropdownContainer && !this.dropdownContainer.contains(e.target)) {
      this.setState({ isOpen: false, })
    }
  }

  handleKeyDown = (e) => {
    const { cursor, } = this.state

    const inactiveNode = !(this.dropdownContainer && this.dropdownContainer.contains(e.target))
    const keyWasNotTab = e.key !== TAB

    if (inactiveNode && keyWasNotTab) { return }

    switch (e.key) {
      case ARROWDOWN:
        e.preventDefault()
        if (cursor < links.length - 1) {
          this.setState(prevState => {
            if (prevState.cursor !== null) {
              return { cursor: prevState.cursor + 1 }
            }
            return { cursor: 0 }
          }, this.updateFocusedLink)
        } else if (cursor === null && links.length === 1) {
          this.setState({ cursor: 0 }, this.updateFocusedLink)
        } else {
          this.updateFocusedLink()
        }
        break
      case ARROWUP:
        e.preventDefault()
        this.setState(prevState => ({ cursor: Math.max(prevState.cursor - 1, 0) }), this.updateFocusedLink)
        break
      case TAB:
        this.setState({ isOpen: false, })
        break
      default:
        break
    }
  }

  handleNameClick = () => {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }))
  }

  renderDropdown() {
    const { isOpen, } = this.state

    if (!isOpen) { return }

    return (<div className="dropdown-menu">
      {links}
    </div>)
  }

  render() {
    const { name, } = this.props
    const displayedName = name.length > MAXIMUM_NAME_LENGTH ? `${name.substring(0, MAXIMUM_NAME_LENGTH)}...`: name
    return (
      <div className="home-nav-right wide student-navbar-items">
        <a className="text-white student-navbar-item focus-on-dark" href="/">Classes</a>
        <a className="text-white student-navbar-item focus-on-dark" href="/student-center">Resources</a>
        <div className="student-navbar-dropdown student-navbar-item" ref={this.dropdownContainerRef}>
          <button className="focus-on-dark" id="name-container" onClick={this.handleNameClick} type="button">
            <img alt="Avatar icon" src={avatarSrc} />
            <span>{displayedName}</span>
            <div aria-label="Dropdown icon" className="dropdown-indicator" />
          </button>
          {this.renderDropdown()}
        </div>
      </div>
    )
  }
}
