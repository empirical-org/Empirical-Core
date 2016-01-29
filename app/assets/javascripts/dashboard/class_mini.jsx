EC.ClassMini = React.createClass({

  // offset: function() {
  //   if (this.props.rowNum !== 1) {
  //     return  "col-md-offset-1";
  //     }
  // },

  // render: function() {
  //   console.log('class mini rendered');
  //   return (
  //     <div className={"classroom_mini col-md-2 row_num_" + this.props.rowNum}>
  //       {this.props.classObj}
  //     </div>
  //   );
  // }
  render: function() {
    console.log('class_mini');
    return (
      <div className={"classroom_mini_container col-md-4 row_num_" + this.props.rowNum}>
        <div className ={"classroom_mini_content"}>
          {this.props.classObj}
        </div>
      </div>
    );
  }
});
