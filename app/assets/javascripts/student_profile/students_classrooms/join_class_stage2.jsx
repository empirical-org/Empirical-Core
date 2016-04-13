EC.JoinClassStage2 = React.createClass({

  render: function() {
    return (
      <div className='additional-class stage-1 text-center'>
        <h1>Join a New Class</h1>
        <span>Add Your Class Code</span>
        <br/>
        <input placeholder='e.g. fresh-bread'></input>
        <button className='button-green'>Join Your Class</button>
        <br/>
        <span>Don't know your classcode?<br/>
          You can ask your teacher for it.</span>
      </div>
    );
  }

});
