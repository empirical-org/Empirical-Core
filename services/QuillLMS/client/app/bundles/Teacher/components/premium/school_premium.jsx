import React from 'react'
export default class SchoolPremium extends React.Component {
  render() {
    return(
      <div className='container premium-features school text-center' id="school-premium">
        <section className='premium-features-header'>
          <div className="img-holder">
            <img alt="Presentation board" src={`${process.env.CDN_URL}/images/shared/blue-school-circle.svg`} />
          </div>
          <h1>School Premium</h1>
          <p>We offer School Premium site licenses that provide access for all teachers at a school to both our free and teacher premium features. In addition, we offer school-wide professional development, administrative oversight and reporting, and individualized, ongoing support from our School Partnerships team.</p>
        </section>
        <div className='premium-features-body'>
          <section>
            <div className="row">
              <div className="col left">
                <div className="premium-features-text">
                  <h3>Teacher Reports</h3>
                  <p>Access each classroom’s Quill Premium reports. Print and download progress reports on concepts and standards mastered.</p>
                </div>
              </div>
              <div className="col right">
                <img alt="Example dashboard showing multiple teacher reports" src={`${process.env.CDN_URL}/images/shared/teacher-reports.svg`} />
              </div>
            </div>
          </section>
          <section>
            <div className="row">
              <div className="col left switch-to-right">
                <img alt="Example school dashboard showing multiple teacher dashboards with student results" src={`${process.env.CDN_URL}/images/shared/school-dashboard.svg`} />
              </div>
              <div className="col right switch-to-left">
                <div className="premium-features-text">
                  <h3>School Administrator Dashboard</h3>
                  <p>Access each teacher’s Premium account to assign activities, manage rosters and view data. Access school-level reports to see rolled up data at the school level.</p>
                </div>
              </div>
            </div>
          </section>
          <section>
            <div className="row">
              <div className="col left">
                <div className="premium-features-text">
                  <h3>School-Wide Educator Support</h3>
                  <p>Access customized training and professional development webinars, instructional coaching sessions, and individualized reporting, all provided by our dedicated School Partnerships team.</p>
                </div>
              </div>
              <div className="col right">
                <img alt="A school with a person giving a presentation and another person teaching" src={`${process.env.CDN_URL}/images/shared/school-support.svg`} />
              </div>
            </div>
          </section>
        </div>
        <div className="printable-summary-box flex-row vertically-centered space-between">
          <span>
            <span className='bold-segment'>Looking for a printable summary?</span>
            We have you covered.
          </span>
          <a className='pdf-button dark-green' href='https://assets.quill.org/documents/quill_premium.pdf' rel="noopener noreferrer" target="_blank">Download PDF</a>
        </div>
      </div>
    );
}
}

SchoolPremium.displayName = 'SchoolPremium'