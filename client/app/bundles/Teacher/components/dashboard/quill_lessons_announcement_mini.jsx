  import React from 'react';

  export default React.createClass({

    miniBuilder() {
      return (
        <div className="mini_content">
          <div className="gray-underline" style={{ position: 'relative', padding: '8px', }}>
            <img src="/assets/icons/icon-star.svg" style={{ position: 'absolute', top: '-11px', right: '-22px', transform: 'rotate(-22deg)', height: '27px', width: '27px', }} />
            <img src="/assets/icons/icon-star.svg" style={{ position: 'absolute', top: '-11px', right: '-3px', transform: 'rotate(-34deg)', height: '14px', width: '14px', }} />
            <h3 style={{ fontWeight: 'normal', }}>New In-Class Collaborative Tool</h3>
          </div>
          <div>
            <a href="/tools/lessons" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '8px', }}><img src="/images/lesson_icons_black.svg" style={{ height: '25px', marginRight: '10px', marginTop: '3px', }} /><p style={{ fontWeight: 'bold', fontSize: '18px', margin: '8px 0 0', }}>Quill Lessons</p></a>
          </div>
          <p style={{ padding: '0px 15px', marginTop: '16px', minHeight: '86px', lineHeight: '1.57', fontFamily: 'lucida-grande, adelle-sans, helvetica', }}>
          Use Quill Lessons to lead whole-class direct instruction with interactive lesson plans. With Quill Lessons, you can see and display student responses in real time.
        </p>
          <a target="_blank" href="https://medium.com/writing-with-quill/quill-launches-quill-lessons-fb983f2b8970"><button style={{ fontWeight: 'normal', maxWidth: '233px', width: '100%', paddingBottom: '13px', }} className="button button-white beta">Learn More</button></a>
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
