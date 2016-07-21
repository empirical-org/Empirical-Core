import React from 'react'
import $ from 'jquery'


export default React.createClass({

  getInitialState: function() {
    return {error: null};
  },

  addClassroom: function() {
    var that = this;
    $.post('../students_classrooms', {classcode: this.refs.classCodeInput.value, authenticity_token:  $('meta[name=csrf-token]').attr('content')})
      .done(function(){
        that.props.advanceStage();
      })
      .fail(function() {
        that.setState({error: 'Invalid Classcode'});
      });
  },

  errorMessage: function() {
    if (this.state.error !== null) {
      return <div><span className='error-message'>Invalid Classcode</span></div>;
    }
  },


  render: function() {
    return (
      <div className='additional-class stage-1 text-center'>
        <h1>Join a New Class</h1>
        <span>Add Your Class Code</span>
        <br/>
        <input className='class-input' ref='classCodeInput' placeholder='e.g. fresh-bread'></input>
        <br/>
        {this.errorMessage()}
        <button className='button-green' onClick={this.addClassroom}>Join Your Class</button>
        <br/>
        <span>Don't know your classcode?<br/>
          You can ask your teacher for it.</span>
      </div>
    );
  }

});
