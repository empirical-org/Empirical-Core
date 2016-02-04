EC.TeacherResourcesMini = React.createClass({

  miniBuilder: function() {
    return (
      <div className='resources-container'>
        <h4>Lorem Ipsum Dolar</h4>
        <a href='/teacher_resources'>
          <img src='/teacher_resources_icons.png'></img>
        </a>
        <p>Consectetur adipiscing elit cras sed.</p>
      </div>
    );
  },

  render: function() {
    return (
      <div className={"mini_container col-md-4 col-sm-5 text-center"}>
        <div className="mini_content">
          {this.miniBuilder()}
        </div>
      </div>
    );
  }
});
