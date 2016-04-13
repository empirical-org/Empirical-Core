EC.JoinClassStage1 = React.createClass({

  addClass: function() {
    $.post('../students_classrooms', {classcode: this.refs.classCodeInput.value})
      .done(function(data){
        // ensure that it was successful here
      });
  },


  render: function() {
    return (
      <div className='additional-class stage-1 text-center'>
        <h1>Join a New Class</h1>
        <span>Add Your Class Code</span>
        <br/>
        <input ref='classCodeInput' placeholder='e.g. fresh-bread'></input>
        <br/>
        <button className='button-green' onClick={this.addClass}>Join Your Class</button>
        <br/>
        <span>Don't know your classcode?<br/>
          You can ask your teacher for it.</span>
      </div>
    );
  }

});
