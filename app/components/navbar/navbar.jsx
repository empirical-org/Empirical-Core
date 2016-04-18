import React from 'react'
import { Link } from 'react-router'

export default React.createClass({
  render: function () {
    return (
      <header className="header" style={{height: '65px'}}>
        <div className="container">
          <div className="header-left">
            <a href="http://www.connect.quill.org" className="header-item">
              <img src="http://45.55.217.62/wp-content/uploads/2016/04/quill_connect_logo2.png"
                alt=""
                style={{height: "35px"}}/>
            </a>
          </div>
          <div className="header-right">
            <a href="http://www.connect.quill.org/dwqa-questions/" className="header-tab" activeClassName="is-active">Questions</a>
            <Link to={'/play'} className="header-tab" activeClassName="is-active">Demo</Link>
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
