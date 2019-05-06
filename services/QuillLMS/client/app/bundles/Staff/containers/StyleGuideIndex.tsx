import * as React from 'react'
import { Route, Switch, Link, } from "react-router-dom";
import Buttons from '../components/styleGuide/buttons'

export default class StyleGuideIndex extends React.Component {
  renderLink(href, text) {
    return <li>
      <Link to={href} activeClassName="is-active">{text}</Link>
    </li>
  }

  render() {
    return <div className="style-guide-index">
      <aside className="menu" style={{ minWidth: 220, borderRight: '1px solid #e3e3e3', padding: 15, paddingLeft: 0, }}>
        <p className="menu-label">
          CSS Elements
        </p>
        <ul className="menu-list">
          {this.renderLink('/buttons', 'Buttons')}
        </ul>
        <p className="menu-label">
          React Components
        </p>
        <ul className="menu-list">
        </ul>
      </aside>
      <h1>Quill Style Guide</h1>
      <Switch>
        <Route path={`/buttons`} component={Buttons}/>
      </Switch>
    </div>
  }
}
