import React from 'react';
import request from 'request';
import $ from 'jquery';
import _ from 'underscore';
import getAuthToken from '../components/modules/get_auth_token';
import NotificationBox from '../components/shared/notification_box.jsx';
import LoadingIndicator from '../components/shared/loading_indicator.jsx';
import InviteCoteachers from '../components/classroom_management/invite_coteachers.jsx';

export default React.createClass({

  propTypes: {
    role: React.PropTypes.string.isRequired,
  },

  getInitialState() {
    let basePath;
    let getClassroomsPath;
    if (this.props.role === 'teacher') {
      basePath = '/teachers/classrooms';
      getClassroomsPath = `${basePath}/archived_classroom_manager_data`;
    } else if (this.props.role === 'student') {
      basePath = '/students_classrooms';
      getClassroomsPath = `${basePath}/classroom_manager_data`;
    }
    return { loading: true, classrooms: null, basePath, getClassroomsPath, myName: '', };
  },

  componentDidMount() {
    this.getClassrooms();
  },

  getClassrooms() {
    this.setState({ loading: true, },
      () => {
        $.ajax({
          url: this.state.getClassroomsPath,
          context: this,
          cache: false,
          success(data) {
            this.formatData(data);
          },
        });
      }
    );
  },

  hashLinkScroll() {
    const hash = window.location.hash;
    if (hash !== '') {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      element ? element.scrollIntoView() : null;
    }
  },

  formatData(data) {
    const coteacherClassroomsAndTeachers = this.formatCoteachers(data.coteachers, true);
    data.coteachers = coteacherClassroomsAndTeachers.coteachers;
    data.coteachersByClassroom = coteacherClassroomsAndTeachers.coteachersByClassroom;
    data.pending_coteachers = this.formatCoteachers(data.pending_coteachers);
    const showArchivedNotification = data.active.length === 0;
    const myName = data.my_name;
    delete data.my_name;
    this.setState({ classrooms: data, loading: false, showArchivedNotification, myName, }, this.hashLinkScroll);
  },

  leaveClassroom(id) {
    if (confirm('Are you sure you want to leave this classroom?')) {
      request.delete(
        {
          url: `${process.env.DEFAULT_URL}/classrooms_teachers/destroy/${id}`,
          json: { authenticity_token: getAuthToken(), },
        }, (e, r, b) => {
        if (e) {
          console.log(e);
        } else {
          this.getClassrooms();
        }
      }
      );
    }
  },

  formatCoteachers(teachers, isCoteachers) {
    const classroomsByCoteacher = {};
    const coteachersByClassroom = {};
    teachers.forEach((coteacher) => {
      if (isCoteachers) {
        // get an array of the coteachers that each classroom has
        coteachersByClassroom[coteacher.name] = coteachersByClassroom[coteacher.name] || [];
        // name is classroom name
        coteachersByClassroom[coteacher.name].push(coteacher.coteacher_name);
      }
      // get an array of the classrooms that each coteacher owns
      classroomsByCoteacher[coteacher.coteacher_email] = classroomsByCoteacher[coteacher.coteacher_email] || [];
      classroomsByCoteacher[coteacher.coteacher_email].push(coteacher.name);
    });
    const newCoteachers = [];
    for (const email in classroomsByCoteacher) {
      if (classroomsByCoteacher.hasOwnProperty(email)) {
        const teacherMatch = teachers.find(t => t.coteacher_email == email);
        teacherMatch.classrooms = classroomsByCoteacher[email];
        delete teacherMatch.name;
        newCoteachers.push(teacherMatch);
      }
    }
    if (isCoteachers) {
      return { coteachersByClassroom, coteachers: newCoteachers, };
    }
    return newCoteachers;
  },

  classAction(status, id) {
    // if loading we don't want to do anything when they click -- effectively
    // it is disabled
    if (!this.state.loading) {
      let path = status === 'Archive' ? 'hide' : 'unhide';
      path = `${this.state.basePath}/${id}/${path}`;
      if (status === 'Archive') {
        if (confirm("Are you sure you want to archive this classroom? If you choose to unarchive it at a later date, your students' activities will not be restored.")) {
          this.postClassroomChange(path);
        }
      } else {
        this.postClassroomChange(path);
      }
    }
  },

  postClassroomChange(path) {
    const that = this;
    this.setState({ loading: true, },
      () => {
        $.post(path)
        .done(
          that.getClassrooms()
        );
      });
  },

  disabledIfLoading() {
    return (this.state.loading ? 'disabled' : null);
  },

  manageClassroom(classroomId) {
    return <a className="manage-class" href={`${this.state.basePath}/${classroomId}/students`}>Edit Students</a>;
  },

  finalContents(cl, action) {
    let displayed = action;
    const myClassroom = cl.ownerName === this.state.myName;
    if (myClassroom) {
      if (this.state.loading) {
        displayed = [<LoadingIndicator key={`button-loading-indicator-for-${cl.id}`} />, <span key={`action-for-${cl.id}`}>{action}</span>];
      }
      return (<span
        onClick={() => { this.classAction(action, cl.id); }}
        className={`flex-row vertically-centered action-container ${action.toLowerCase()} ${cl.className.replace(/ /g, '')}`}
      >
        {displayed}
      </span>);
    }
    return (<span
      onClick={() => { this.leaveClassroom(cl.id); }}
      className={`flex-row vertically-centered action-container ${cl.className.replace(/ /g, '')}`}
    >
          Leave Classroom
        </span>);
  },

  editOrRemove(action, coteacher_email, coteacher_id) {
    if (action == 'pending_coteachers') {
      return <td className="edit-or-remove" onClick={() => { this.removePendingCoteacher(coteacher_email); }}><i className="fa fa-times-circle" aria-hidden="true" />Remove</td>;
    }
    return <td className="edit-or-remove"><a href={`/classrooms_teachers/${coteacher_id}/edit_coteacher_form`}><i className="fa fa-pencil" aria-hidden="true" />Edit</a></td>;
  },

  removePendingCoteacher(coteacher_email) {
    request({
      url: `${process.env.DEFAULT_URL}/invitations/destroy_pending_invitations_to_specific_invitee`,
      method: 'DELETE',
      json: { invitee_email: coteacher_email, invitation_type: 'coteacher', authenticity_token: getAuthToken(), },
    },
    (err, httpResponse, body) => {
      if (httpResponse.statusCode === 200) {
        this.getClassrooms();
      } else {
        alert('Sadly, an error occurred.');
      }
    });
  },

  handleAccept(classroom_invitation_id) {
    request({
      url: `${process.env.DEFAULT_URL}/coteacher_classroom_invitations/accept_pending_coteacher_invitations`,
      method: 'POST',
      json: { coteacher_invitation_ids: [classroom_invitation_id], authenticity_token: getAuthToken(), },
    },
    (err, httpResponse, body) => {
      if (httpResponse.statusCode === 200) {
        this.getClassrooms();
      } else {
        alert('Sadly, an error occurred.');
      }
    });
  },

  handleReject(classroom_invitation_id) {
    request({
      url: `${process.env.DEFAULT_URL}/coteacher_classroom_invitations/reject_pending_coteacher_invitations`,
      method: 'POST',
      json: { coteacher_invitation_ids: [classroom_invitation_id], authenticity_token: getAuthToken(), },
    },
    (err, httpResponse, body) => {
      if (httpResponse.statusCode === 200) {
        this.getClassrooms();
      } else {
        alert('Sadly, an error occurred.');
      }
    });
  },

  transferOwnership(classroomId, coteacherId) {
    const confirm = prompt("Are you sure you want to transfer ownership of this classroom? You will lose access to certain features like archiving this classroom and editing its activity packs. To continue with the transfer, please type 'TRANSFER' into the box below and hit submit. Otherwise, just hit submit.");
    if (confirm.toLowerCase() === 'transfer') {
      request({
        url: `${process.env.DEFAULT_URL}/teachers/classrooms/${classroomId}/transfer_ownership`,
        method: 'POST',
        json: { id: classroomId, requested_new_owner_id: coteacherId, authenticity_token: getAuthToken(), },
      },
      (err, httpResponse, body) => {
        if (httpResponse.statusCode === 200) {
          this.getClassrooms();
        } else {
          alert('Sadly, an error occurred.');
        }
      });
    } else {
      alert('Transfer cancelled.');
    }
  },

  tableRows(cl, action) {
    const manageClass = action === 'Archive' ? this.manageClassroom(cl.id) : '';
    if (this.props.role === 'teacher') {
      if (action === 'coteachers' || action == 'pending_coteachers') {
        return (
          <tr key={cl.email} className={`${action}_row`}>
            <td>{cl.coteacher_name || '—'}</td>
            <td>{cl.coteacher_email}</td>
            <td>{action == 'pending_coteachers' ? 'Pending' : 'Approved'}</td>
            <td>{cl.classrooms.map(classroom => <p key={`${classroom}-${cl.coteacher_email}`}>{classroom}</p>)}</td>
            {this.editOrRemove(action, cl.coteacher_email, cl.coteacher_id)}
          </tr>
        );
      }
      if (cl.invitation) {
        return (
          <tr key={`${cl.classroom_invitation_id}invite`}>
            <td className="pending-invitation-class-name">{cl.classroom_name}</td>
            <td className="pending-invitation-row" colSpan={7}>{cl.inviter_name} has invited you to co-teach this class.
              (<a onClick={() => this.handleAccept(cl.classroom_invitation_id)}>Accept Invite</a> / <a onClick={() => this.handleReject(cl.classroom_invitation_id)}>Decline Invite</a>)
            </td>
          </tr>
        );
      }
      let coteacherCell;
      if (cl.coteachers && cl.coteachers.length) {
        coteacherCell = cl.coteachers.map(coteacher =>
          <p key={`${coteacher.name}-${coteacher.email}-coteacher-list`}>
            {coteacher.name}
            {cl.ownerName == this.state.myName ? <a onClick={() => this.transferOwnership(cl.id, coteacher.id)} className="transfer-ownership">(transfer class)</a> : null}
          </p>
        );
      }

      return (
        <tr key={cl.id}>
          <td>{cl.className}</td>
          <td>{cl.ownerName}</td>
          <td>{coteacherCell}</td>
          <td>{cl.from_google ? <span className="google-classcode">Synced from Google Classroom</span> : cl.classcode}</td>
          <td className="student-count">{cl.studentCount}</td>
          <td className="created-date">{cl.createdDate}</td>
          <td>{manageClass}</td>
          <td>{this.finalContents(cl, action)}</td>
        </tr>);
    } else if (this.props.role === 'student') {
      return (
        <tr key={cl.id}>
          <td>{cl.ownerName}</td>
          <td>{cl.teacherName}</td>
          <td>{cl.className}</td>
          <td>{cl.joinDate}</td>
          <td>{this.finalContents(cl, action)}</td>
        </tr>
      );
    }
  },

  tableHeaders(action) {
    let content;
    if (this.props.role === 'teacher') {
      if (action === 'coteachers') {
        content = (
          <tr>
            <th>Co-Teacher Name</th>
            <th>Email Address</th>
            <th>Status</th>
            <th>Classes</th>
            <th />
          </tr>
      );
      } else {
        const manageClass = action === 'Archive' ? 'Edit Students' : '';
        content =
        (<tr>
          <th>Class Name</th>
          <th>Owner</th>
          <th>Co-Teachers</th>
          <th>Classcode</th>
          <th className="student-count">Student Count</th>
          <th className="created-date">Date Created</th>
          <th>{manageClass}</th>
          <th />
        </tr>)
        ;
      }
    } else if (this.props.role === 'student') {
      content =
       (<tr>
         <th>Teacher Name</th>
         <th>Class Name</th>
         <th>Date Joined</th>
         <th />
       </tr>)
     ;
    }
    return (<thead>
      {content}
    </thead>);
  },

  mapClassrooms(classrooms, status) {
    const that = this;
    const classes = _.map(classrooms, cl => (
        that.tableRows(cl, status)
      ));
    return classes;
  },

  displayClassrooms(classrooms, status) {
    return (
      <table className="table">
        {this.tableHeaders(status)}
        <tbody>
          {this.mapClassrooms(classrooms, status)}
        </tbody>
      </table>
    );
  },

  joinOrAddClass() {
    if (this.props.role === 'student') {
      return (<a href="/add_classroom" className="btn button-green">Join a Class</a>);
    }
  },

  activeOrArchived(section, action) {
    const classes = this.state.classrooms[section];
    const header = <h1>{`${section.charAt(0).toUpperCase() + section.slice(1)} Classes`}</h1>;
    if (classes.length > 0) {
      return (
        <div id={`${section}-classes`}>
          {header}
          {this.displayClassrooms(this.state.classrooms[section], action)}
        </div>
      );
    }
  },

  coteachers() {
    if (this.state.classrooms.coteachers.length || this.state.classrooms.pending_coteachers.length) {
      return (
        <div id="my-coteachers">
          <h1>My Co-Teachers</h1>
          <table className="table">
            {this.tableHeaders('coteachers')}
            <tbody>
              {this.mapClassrooms(this.state.classrooms.pending_coteachers, 'pending_coteachers')}
              {this.mapClassrooms(this.state.classrooms.coteachers, 'coteachers')}
            </tbody>
          </table>
        </div>
      );
    }
  },

  stateSpecificComponents() {
    if (this.state.classrooms !== null) {
      return (
        <div className={this.props.role}>
          {this.activeOrArchived('active', 'Archive')}
          {this.activeOrArchived('inactive', 'Unarchive')}
          {this.coteachers()}
        </div>
      );
    }
    return <h1>loading</h1>;
  },

  archivedNotification() {
    if (this.state.showArchivedNotification) {
      return (
        <NotificationBox>
          You’ve archived all your classes! Before you can assign new activities,
          you’ll need to <span>Unarchive</span> or <span>Create</span> a new class.
        </NotificationBox>
      );
    }
  },

  optionSection() {
    return (
      <div className="archive-options-container">
        <h1 className="main-title">Manage Classes</h1>
        <div className="flex-row vertically-centered space-between">
          <p>On this page, you can archive and unarchive classes. You can also click on <strong>Edit Students</strong> to reset students’ passwords below.</p>
          <div className="cta-box">
            <a href="/teachers/classrooms/new" className="q-button cta-button bg-white">Create a Class</a>
            <a href="/teachers/classrooms/google_sync" className="q-button cta-button bg-white">Sync with Google Classroom</a>
          </div>
        </div>
      </div>);
  },

  render() {
    return (
      <div id="archived_classrooms_manager">
        {this.archivedNotification()}
        {this.optionSection()}
        {this.joinOrAddClass()}
        {this.stateSpecificComponents()}
        <InviteCoteachers onSuccess={this.getClassrooms} classrooms={this.state.classrooms ? this.state.classrooms.active_classrooms_i_own : []} />
      </div>
    );
  },
});
