EC.AdminsTeachers = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    sortHandler: React.PropTypes.func.isRequired,
    currentSort: React.PropTypes.object.isRequired,
    columns: React.PropTypes.object.isRequired
  },

  rows: function () {
    return _.map(this.props.data, function (teacher) {
      var result;
      var links = _.map(teacher.links, function (link) {
        return <div><a className='green-link' href={link.path}>{link.name}</a></div>
      }, this);
      result = <span>{links}</span>
      teacher.link_components = result;
      return teacher
    }, this);
  },

  render: function () {

    var teachers = _.map(this.props.data, function (teacher) {
      return <EC.AdminsTeacher key={teacher.id} data={teacher} />
    }, this)
    return (
      <div className='admins-teachers'>
        <EC.SortableTable columns={this.props.columns}
                          rows={this.rows()}
                          currentSort={this.props.currentSort}
                          sortHandler={this.props.sortHandler}
                          shouldTransition={true}
                          transitionName={'adminTeacher'}/>
      </div>

    );
  }
});