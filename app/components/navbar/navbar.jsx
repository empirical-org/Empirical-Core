import React from 'react'
import { Link } from 'react-router'

export default React.createClass({
  render: function () {
    return (
      <header className="header">
        <div className="container">
          <div className="header-left">
            <Link to={'/'} className="header-item">Quill Connect</Link>
            <Link to={'/play'} className="header-tab" activeClassName="is-active">Play</Link>
            <Link to={'/results'} className="header-tab" activeClassName="is-active">Results</Link>
          </div>
          <span className="header-toggle">
            <span />
            <span />
            <span />
          </span>
        </div>
      </header>
    )
  }
})

const rightNav = (<div className="header-right header-menu">
  <span className="header-item">
    <Link to={'/admin'} className="header-item" activeClassName="is-active">Admin</Link>
  </span>
  <span className="header-item">
    <a href="#">
      Help
    </a>
  </span>
  <span className="header-item">
    <a className="button" href="#">Button</a>
  </span>
</div>)
