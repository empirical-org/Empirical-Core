import React from 'react'

export default React.createClass({
  render: function () {
    return (
<header className="header">
        <div className="container">
          <div className="header-left">
            <a className="header-item" href="#">
              Quill Connect
            </a>
            <a className="header-tab" href="#">
              Play
            </a>
            <a className="header-tab" href="#">
              Results
            </a>
          </div>
          <span className="header-toggle">
            <span />
            <span />
            <span />
          </span>
          <div className="header-right header-menu">
            <span className="header-item">
              <a href="#">
                About
              </a>
            </span>
            <span className="header-item">
              <a href="#">
                Help
              </a>
            </span>
            <span className="header-item">
              <a className="button" href="#">Button</a>
            </span>
          </div>
        </div>
      </header>

    )
  }
})
