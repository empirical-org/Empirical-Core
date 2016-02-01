EC.AddClassMini = React.createClass({

  render: function() {
    return (
      <div className={"classroom_mini_container col-md-4 row_num_" + this.props.rowNum}>
        <div className ={"classroom_mini_content text-center"}>
          <a className='add_class_link' href="/teachers/classrooms/new">
            <img className='plus_icon' src='/add_class.png'></img>
            <h3>Add a Class</h3>
          </a>
        </div>
      </div>
    );
  }

});
