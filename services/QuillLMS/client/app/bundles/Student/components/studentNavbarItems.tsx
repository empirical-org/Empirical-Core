import * as React from 'react';

const avatarSrc = `${process.env.VITE_PROCESS_ENV_CDN_URL}/images/icons/avatar.svg`
const menuSrc = `${process.env.VITE_PROCESS_ENV_CDN_URL}/images/icons/menu.svg`
const closeSrc = `${process.env.VITE_PROCESS_ENV_CDN_URL}/images/icons/close-white.svg`

interface StudentNavbarItemsProps {
  name: string;
}

interface StudentNavbarItemsState {
  isOpen: boolean;
  cursor: null|number;
}

const MAX_VIEW_WIDTH_FOR_MOBILE = 895
const MAXIMUM_NAME_LENGTH = 27
const TAB = 'Tab'
const ARROWDOWN = 'ArrowDown'
const ARROWUP = 'ArrowUp'
const MOUSEDOWN = 'mousedown'
const KEYDOWN = 'keydown'

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

  onMobile = () => window.innerWidth <= MAX_VIEW_WIDTH_FOR_MOBILE

  links = () => {
    const desktopLinks = [
      <a href="/account_settings" id="settings-link" key="settings-link">Settings</a>,
      <a href="/session" id="logout-link" key="logout-link">Logout</a>
    ]
    const mobileLinks = [
      <a href="/" id="classes-link" key="classes-link">Classes</a>,
      <a href="/student-center" id="resources-link" key="resources-link">Resources</a>
    ]

    if (this.onMobile()) {
      return mobileLinks.concat(desktopLinks)
    }

    return desktopLinks
  }

  updateFocusedLink = () => {
    const { cursor, } = this.state
    const focusedLink = this.links()[cursor]

    const element = document.getElementById(focusedLink.key)
    element.focus()
  }

  dropdownContainerRef = (node) => this.dropdownContainer = node

  handleClickOutsideDropdown = (e) => {
    if (!this.onMobile() && this.dropdownContainer && !this.dropdownContainer.contains(e.target)) {
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
        if (cursor < this.links().length - 1) {
          this.setState(prevState => {
            if (prevState.cursor !== null) {
              return { cursor: prevState.cursor + 1 }
            }
            return { cursor: 0 }
          }, this.updateFocusedLink)
        } else if (cursor === null && this.links().length === 1) {
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

  handleOpenToggle = () => {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }))
  }

  renderDropdown() {
    const { isOpen, } = this.state

    if (!isOpen) { return }

    return (
      <div className="dropdown-menu">
        {this.links()}
      </div>
    )
  }

  renderMobileMenu() {
    const { isOpen, } = this.state

    if (!isOpen) { return }

    return (
      <div className="mobile-student-nav-menu">
        {this.links()}
      </div>
    )
  }

  renderDesktopNavbar = () => {
    const { isOpen, } = this.state
    const { name, } = this.props
    const displayedName = name.length > MAXIMUM_NAME_LENGTH ? `${name.substring(0, MAXIMUM_NAME_LENGTH)}...`: name
    const dropdownIndicatorClass = isOpen ? "dropdown-indicator rotated" : "dropdown-indicator"
    return (
      <div className="home-nav-right wide">
        <a className="student-navbar-item focus-on-light" href="/">Classes</a>
        <a className="student-navbar-item focus-on-light" href="/student-center">Resources</a>
        <div className="student-navbar-dropdown student-navbar-item" ref={this.dropdownContainerRef}>
          <button className="focus-on-dark" id="name-container" onClick={this.handleOpenToggle} type="button">
            <span>{displayedName}</span>
            <div aria-label="Dropdown icon" className={dropdownIndicatorClass} />
          </button>
          {this.renderDropdown()}
        </div>
      </div>
    )
  }

  renderMobileNavbar = () => {
    const { isOpen, } = this.state
    const img = isOpen ? <img alt="Close icon" src={closeSrc} /> : <img alt="Menu icon" src={menuSrc} />
    const text = isOpen ? 'Close' : 'Menu'
    return (
      <div className="mobile-nav-right">
        <button className="focus-on-dark" id="mobile-dropdown-container" onClick={this.handleOpenToggle} type="button">
          {img}
          <span>{text}</span>
        </button>
        {this.renderMobileMenu()}
      </div>
    )
  }


  render() {
    return (
      <div className="student-navbar-items">
        {this.renderDesktopNavbar()}
        {this.renderMobileNavbar()}
      </div>
    )
  }
}
