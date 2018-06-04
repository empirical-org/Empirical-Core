import React from 'react';

export default React.createClass({
  render: function() {
    return (
      <div className="modal is-active">
        <div className="modal-background" />
          <div className="modal-container">
            <div className="modal-content">
              {this.props.children}
          </div>
        </div>
        <button className="modal-close" onClick={this.props.close}/>
      </div>
    )
  }
})
