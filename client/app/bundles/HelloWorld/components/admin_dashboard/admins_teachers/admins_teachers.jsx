import React from 'react';
import AdminsTeacher from './admins_teacher.jsx';
import SortableTable from '../../general_components/table/sortable_table/sortable_table.jsx';

export default React.createClass({
  propTypes: {
    data: React.PropTypes.array.isRequired,
    sortHandler: React.PropTypes.func.isRequired,
    currentSort: React.PropTypes.object.isRequired,
    columns: React.PropTypes.array.isRequired,
    loading: React.PropTypes.bool.isRequired,
  },
  //
  // handleClick(e) {
  //   // e.stopPropagation();
  //   // e.nativeEvent.stopImmediatePropagation();
  // },

  linkGenerator(link) {
    if (this.props.isValid) {
      return <a className="green-link" href={link.path}>{link.name}</a>;
    }
    return <a className="green-link" onClick={() => alert('Your Premium Subscription Has Expired. Please visit Quill.org/premium to access this feature.')}>{link.name}</a>;
  },

  rows() {
    const that = this;
    return _.map(this.props.data, function (teacher) {
      let result;
      const links = _.map(teacher.links, link => <div key={link.name}>{that.linkGenerator(link)}</div>, this);
      result = <span>{links}</span>;
      teacher.link_components = result;
      return teacher;
    }, this);
  },

  render() {
    const teachers = _.map(this.props.data, teacher => <AdminsTeacher key={teacher.id} data={teacher} />, this);
    return (
      <div className={`admins-teachers ${this.props.isValid ? '' : 'blur'}`}>
        <SortableTable
          columns={this.props.columns}
          rows={this.rows()}
          loading={this.props.loading}
          currentSort={this.props.currentSort}
          sortHandler={this.props.sortHandler}
          shouldTransition
          transitionName={'adminTeacher'}
        />
      </div>

    );
  },
});
