import * as React from 'react'

import PostNavigationBanners from '../components/styleGuide/postNavigationBanners'
import Buttons from '../components/styleGuide/buttons'
import Cards from '../components/styleGuide/cards'
import ColorPalette from '../components/styleGuide/colorPalette'
import Icons from '../components/styleGuide/icons'
import Typography from '../components/styleGuide/typography'
import DataTables from '../components/styleGuide/dataTables'
import DropdownInputsWithSearchTokens from '../components/styleGuide/dropdownInputsWithSearchTokens'
import Menus from '../components/styleGuide/menus'
import Sliders from '../components/styleGuide/sliders'
import Snackbars from '../components/styleGuide/snackbars'
import TextFields from '../components/styleGuide/textFields'
import Tooltips from '../components/styleGuide/tooltips'
import Checkboxes from '../components/styleGuide/checkBoxes'
import RadioButtons from '../components/styleGuide/radioButtons'

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
            {this.renderLink('#color-palette', 'Color Palette')}
            {this.renderLink('#typography', 'Typography')}
            {this.renderLink('#buttons', 'Buttons')}
            {this.renderLink('#icons', 'Icons')}
          </ul>
          <p className="menu-label">
          HTML Elements
          </p>
          <ul className="menu-list">
            {this.renderLink('#icons', 'Icons')}
          </ul>
          <p className="menu-label">
          React Components
          </p>
          <ul className="menu-list">
            {this.renderLink('#cards', 'Cards')}
            {this.renderLink('#menus', 'Menus (DropdownInputs)')}
            {this.renderLink('#menus-with-search-tokens', 'Menus (DropdownInputs) with Search Tokens')}
            {this.renderLink('#textFields', 'Text Fields (Inputs)')}
            {this.renderLink('#checkboxes', 'Checkboxes')}
            {this.renderLink('#radiobuttons', 'Radio Buttons')}
            {this.renderLink('#snackbars', 'Snackbars')}
            {this.renderLink('#tooltips', 'Tooltips')}
            {this.renderLink('#data-tables', 'Data Tables')}
            {this.renderLink('#sliders', 'Sliders')}
            {this.renderLink('#post-navigation-banners', 'Post Navigation Banners')}
          </ul>
        </aside>
        <div className="style-guide">
          <h1>Backpack</h1>
          <h2>Quill&#39;s Style Guide</h2>
          <p>For CSS elements, the text above the element is a list of class names necessary to apply the styles or the variable used for the color. For React components, the text is the code for rendering the component. All React components in Backpack are exportable from the `Shared/index` folder.</p>
          <ColorPalette />
          <Typography />
          <Buttons />
          <Icons />
          <Cards />
          <Menus />
          <DropdownInputsWithSearchTokens />
          <TextFields />
          <Checkboxes />
          <RadioButtons />
          <Snackbars />
          <Tooltips />
          <DataTables />
          <Sliders />
          <PostNavigationBanners />
        </div>
      </div>
    )
  }
}
