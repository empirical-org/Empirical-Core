EC.ClassMini = React.createClass({


  render: function() {
    console.log('class mini rendered');
    return (
      <div className='col-md-3'>
        {this.props.classObj}
      </div>
    );
  }

});
