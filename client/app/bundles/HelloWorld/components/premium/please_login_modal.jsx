import React from 'react'
export default React.createClass ({
  render: function() {
    return (
      <div className="modal fade">
        <div className='container'>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"><i className="fa fa-close"></i></span></button>
                <h4 className="modal-title"><strong>Please Login to Proceed!</strong></h4>
            </div>
            <div className="modal-body csv-email-modal">
              <p>Before you can begin your trial or purchase Premium, you'll need to login to Quill account.</p>
            </div>
            <div className="modal-footer">
              <a href='session/new'><button type="button" className="button-green">Sign Into Quill</button></a>
            </div>
          </div>
        </div>
        </div>
      </div>
    );
  }

});
