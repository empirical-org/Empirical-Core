"use strict";

EC.ExportCsvModal = React.createClass({
  propTypes: {
    email: React.PropTypes.string
  },

  render: function() {
    return (
      <div className="modal fade">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"><i className="fa fa-close"></i></span></button>
              <h4 className="modal-title"><strong>Your reports are on the way!</strong></h4>
            </div>
            <div className="modal-body">
              <p>Your Quill Progress Report is on its way! This table is being emailed to you as a CSV spreadsheet, which can be opened with Google Sheets or Excel. It should arrive within the next five minutes.</p>
              <p>Please Check: <strong>{this.props.email}</strong></p>
            </div>
            <div className="modal-footer">
              <button type="button" className="button-green" data-dismiss="modal">Got It</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
