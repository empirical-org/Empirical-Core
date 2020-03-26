import React from 'react'
export default class TeacherPremium extends React.Component {
  render() {
    return(
      <div className='premium-feature-wrapper'>
        <div className='container premium-features teacher text-center' id="teacher-premium">
          <section className='premium-features-header'>
            <div className="img-holder">
              <img alt="Presentation board" src={`${process.env.CDN_URL}/images/shared/presentation-board-circle.svg`} />
            </div>
            <h1>Teacher Premium</h1>
            <p>We offer Teacher Premium licenses that include all of our free features as well as advanced reports on concept mastery and state standards, the ability to download, print, and export reports, and priority user support.</p>
          </section>
          <div className='premium-features-body'>
            <section>
              <div className="row">
                <div className="col left">
                  <div className="premium-features-text">
                    <h3>Activity Scores</h3>
                    <p>View students’ overall average on Quill as well as their individual scores by Activity Pack and Activity. Print this progress report for each of your students to help them visualize their progress on Quill.</p>
                  </div>
                </div>
                <div className="col right">
                  <img alt="Example individual report showing a table of activities scored" src={`${process.env.CDN_URL}/images/shared/activity-scores-report.svg`} />
                </div>
              </div>
            </section>
            <section>
              <div className="row">
                <div className="col left switch-to-right">
                  <img alt="Example concepts report showing a table of concepts scored" src={`${process.env.CDN_URL}/images/shared/concept-report.svg`} />
                </div>
                <div className="col right switch-to-left">
                  <div className="premium-features-text">
                    <h3>Concept Report</h3>
                    <p>Get insight into which concepts are areas of strength for students, and which are areas for growth. Use this information to build a personalized curriculum.</p>
                  </div>
                </div>
              </div>
            </section>
            <section>
              <div className="row">
                <div className="col left">
                  <div className="premium-features-text">
                    <h3>Academic Standards Report</h3>
                    <p>Track class and student level progress of academic standards to determine student mastery and next steps.</p>
                  </div>
                </div>
                <div className="col right">
                  <img alt="Example standards report showing a table of standards scored by proficiency" src={`${process.env.CDN_URL}/images/shared/standards-report.svg`} />
                </div>
              </div>
            </section>
          </div>
          <div className="printable-summary-box flex-row vertically-centered space-between">
            <span>
              <span className='bold-segment'>Looking for a printable summary?</span>
              We have you covered.
            </span>
            <a className='pdf-button' href='https://assets.quill.org/documents/quill_premium.pdf' rel="noopener noreferrer" target="_blank">Download PDF</a>
          </div>
        </div>
      </div>
    );
}
}

TeacherPremium.displayName = 'TeacherPremium';
