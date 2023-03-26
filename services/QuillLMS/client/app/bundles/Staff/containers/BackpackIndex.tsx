import * as React from 'react'
import Buttons from '../components/styleGuide/buttons'
import Cards from '../components/styleGuide/cards'
import DataTables from '../components/styleGuide/dataTables'
import Menus from '../components/styleGuide/menus'
import Sliders from '../components/styleGuide/sliders'
import Snackbars from '../components/styleGuide/snackbars'
import TextFields from '../components/styleGuide/textFields'
import Tooltips from '../components/styleGuide/tooltips'

export default class BackpackIndex extends React.Component {
  renderLink(href, text) {
    return (
      <li>
        <a href={href}>{text}</a>
      </li>
    )
  }

  render() {
    return (
      <div className="style-guide-index">
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
            {this.renderLink('#tooltips', 'Tooltips')}
            {this.renderLink('#data-tables', 'Data Tables')}
            {this.renderLink('#sliders', 'Sliders')}
          </ul>
        </aside>
        <div className="style-guide">
          <h1>Backpack</h1>
          <h2>Quill's Style Guide</h2>
          <p>For CSS elements, the text above the element is a list of class names necessary to apply the styles. For React components, the text is the code for rendering the component. All React components in Backpack are exportable from the `Shared/index` folder.</p>
          <Buttons />
          <Cards />
          <Menus />
          <TextFields />
          <Snackbars />
          <Tooltips />
          <DataTables />
          <Sliders />
        </div>
      </div>
    )
  }
}
