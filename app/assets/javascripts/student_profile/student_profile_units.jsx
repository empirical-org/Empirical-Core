'use strict';
EC.StudentProfileUnits = React.createClass({
  propTypes: {

  },

  render: function () {
    /*
    completed activities is just another fake table under unstarted activities
    */
    return (
      <div className='container'>
        <section>
          <h3 className="section-header">Great Unit</h3>
          <div className="fake-table">
            <div className="header">Assigned Activities
              <span className="header-list-counter">4 of 10</span>
            </div>

            <div className="line">
              <div className="row">
                <div className="col-xs-9 col-sm-10 col-xl-10 pull-left">
                  <div className="activate-tooltip icon-wrapper icon-gray icon-puzzle"></div>
                  <div className="icons-description-wrapper">
                    <p className="title title-v-centered">A, An, The</p>
                  </div>
                </div>
                <div className="col-xs-3 col-sm-2 col-xl-2">
                  <a>Start Lesson</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
})
