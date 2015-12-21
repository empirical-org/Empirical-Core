EC.AdminDashboardHeader = React.createClass({

  render: function () {
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-6">
            <button className="btn btn-default">Add a New Teacher</button><br/>
            <button className="btn btn-default">Bulk Upload via CSV</button>
          </div>
          <div className="col-xs-12 col-md-6">
            <h4>Your Personal Quill Premium Representative</h4>
            <div className="row">
              <div className="col-xs-3">
                <img src="http://www.fillmurray.com/300/300" className="thumbnail img-responsive"/>
              </div>
              <div className="col-xs-9">
                <h5>Elliot Mandel</h5>
                <p>"As your Quill Representative, I'm here to help!"
                  <br/>
                  <br/>
                  201-491-5568<br/>
                <a href="mailto:elliot@quill.org">elliot@quill.org</a>
                </p>

              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

})
