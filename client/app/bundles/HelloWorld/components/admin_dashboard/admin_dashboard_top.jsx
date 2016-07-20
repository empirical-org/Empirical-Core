import React from 'react'

export default React.createClass({

  render: function () {
    return (
      <div className="admin-dashboard-top">
        <div className="row">
          <div className="col-xs-12 col-md-7">
            <a href="mailto:ryan@quill.org?subject=Bulk Upload Teachers via CSV&body=Please attach your CSV file to this email.">
              <button className="button-green">Bulk Upload Teachers via CSV</button>
            </a>
          </div>
          <div className="col-xs-12 col-md-5 representative">
            <div className='row'>
              <div className='col-xs-12'>
                <h4 className='representative-header'>Your Personal Quill Premium Representative</h4>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-3">
                <div className='thumb-elliot' />
              </div>
              <div className="col-xs-9">
                <h3>Elliot Mandel</h3>
                <p>{"As your Quill Representative, I'm here to help!"}</p>
                <div className='representative-contact'>
                  <p>646-820-7136</p>
                  <p>
                    <a className='green-link' href="mailto:elliot@quill.org">elliot@quill.org</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

})
