import React from 'react';

export default React.createClass({

  miniBuilder() {
    return (
      <div className="mini_content">
        <div className="gray-underline" style={{ position: 'relative', padding: '8px', }}>
          <img className="mini-star-icon" src="/assets/icons/icon-star.svg" style={{ position: 'absolute', top: '-11px', right: '-22px', transform: 'rotate(-22deg)', height: '27px', width: '27px', }} />
          <img className="mini-star-icon" src="/assets/icons/icon-star.svg" style={{ position: 'absolute', top: '-11px', right: '-3px', transform: 'rotate(-34deg)', height: '14px', width: '14px', }} />
          <h3>Co-Teaching is Now Available</h3>
        </div>
        <div>
          <img style={{marginTop: 13, marginBottom: 11, width: 57}} src="https://assets.quill.org/images/illustrations/high-five-illustrationx2.png"/>
        </div>
        <p style={{ padding: '0px 15px', lineHeight: '1.57', fontFamily: 'lucida-grande, adelle-sans, helvetica', }}>
        You can now invite co-teachers to your classes. Co-teachers can manage classes, assign activities and view reports.
      </p>
        <a style={{display: 'block', marginBottom: '12px'}} href="/teachers/classrooms#invite-coteachers"><button style={{ maxWidth: '233px', width: '100%', paddingBottom: '13px', marginTop: '15px'}} className="button button-white beta">Invite Co-Teachers</button></a>
        <a style={{color: '#027360'}} target="_blank" href="http://support.quill.org/getting-started-for-teachers/manage-classes/how-do-i-share-a-class-with-my-co-teacher">Learn more about co-teaching ></a>
      </div>
    );
  },

  render() {
    return (
      <div className={'mini_container results-overview-mini-container col-md-4 col-sm-5 text-center'}>
        {this.miniBuilder()}
      </div>
    );
  },
});
