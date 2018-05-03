import React from 'react'
import $ from 'jquery'


export default React.createClass({

  getInitialState: function() {
    return {error: null};
  },

  addClassroom: function() {
    var that = this;
    $.post('../students_classrooms', {classcode: this.refs.classCodeInput.value, authenticity_token:  $('meta[name=csrf-token]').attr('content')})
      .success(function(){
        that.props.advanceStage();
      })
      .fail(function(jqXHR) {
        var error = 'Oops! Looks like that isn\'t a valid class code. Please try again.';
        if(jQuery.parseJSON(jqXHR.status) == 403) {
          error = 'Oops! You need to be signed in to join a class.'
          window.location.assign('/session/new')
        }
        if(jQuery.parseJSON(jqXHR.responseText).error == 'Class is archived') {
          error = 'Oops! That class has been archived. Please try a different class code.';
        }
        that.setState({error: error});
      });
  },

  errorMessage: function() {
    if (this.state.error !== null) {
      return <div><span className='error-message'>{this.state.error}</span></div>;
    }
  },


  render: function() {
    return (
      <div className="page-content-wrapper" id='add-additional-class'>
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
      </div>
    );
  }

});
