import React from 'react';
export default class extends React.Component {
  render() {
    return (
      <div className="modal fade">
        <div className='container'>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button aria-label="Close" className="close" data-dismiss="modal" type="button"><span aria-hidden="true"><i className="fas fa-close" /></span></button>
                <h4 className="modal-title"><strong>Please Login to Proceed!</strong></h4>
              </div>
              <div className="modal-body csv-email-modal">
                <p>Before you can begin your trial or purchase Premium, you'll need to login to Quill account.</p>
              </div>
              <div className="modal-footer">
                <a href='session/new'><button className="button-green" type="button">Sign Into Quill</button></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
