import React from 'react'

export default React.createClass({

  render: function() {
    return (
      <div className='container text-center firewall-warning'>
        <p>We've detected that you may have a firewall blocking part of Quill. If you experience any issues with this activity loading, please contact your teacher or IT department, and ask them to whitelist <a href='http://www.grammar.quill.org'>grammar.quill.org</a>.</p>
      </div>
    );
  }

});
