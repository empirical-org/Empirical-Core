import * as React from 'react'
import Buttons from '../components/styleGuide/buttons'
import Cards from '../components/styleGuide/cards'
import Menus from '../components/styleGuide/menus'
import TextFields from '../components/styleGuide/textFields'
import Snackbars from '../components/styleGuide/snackbars'

export default class StyleGuideIndex extends React.Component {
  renderLink(href, text) {
    return <li>
      <a href={href}>{text}</a>
    </li>
  }

  render() {
    return <div className="style-guide-index">
      <aside className="menu">
        <p className="menu-label">
          CSS Elements
        </p>
        <ul className="menu-list">
          {this.renderLink('#buttons', 'Buttons')}
        </ul>
        <p className="menu-label">
          React Components
        </p>
        <ul className="menu-list">
          {this.renderLink('#cards', 'Cards')}
          {this.renderLink('#menus', 'Menus')}
          {this.renderLink('#textFields', 'Text Fields')}
          {this.renderLink('#snackbars', 'Snackbars')}
        </ul>
      </aside>
      <div className="style-guide">
        <h1>Quill Style Guide</h1>
        <p>For CSS elements, the text above the element is a list of class names necessary to apply the styles. For React components, the text is the code for rendering the component. All React components in the style guide are exportable from the quill-component-library node module.</p>
        <Buttons />
        <Cards />
        <Menus />
        <TextFields />
        <Snackbars />
      </div>
    </div>
  }
}
