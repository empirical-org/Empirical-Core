import React, {Component} from 'react'
import { connect } from 'react-redux';
import _ from 'lodash'
import * as CustomizeIntf from '../../../interfaces/customize'
import { hashToCollection, } from '../../../../Shared/index'

class AllUserEditions extends Component<any, any> {
  constructor(props){
    super(props);
    this.state = {
      editions: {},
      sort: 'last_published_at',
      direction: 'dsc'
    }
  }

  UNSAFE_componentWillMount() {
    this.getEditions(this.props)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { customize, } = this.props
    const { editions, } = this.state
    if (nextProps.classroomLessons.hasreceiveddata) {
      if (nextProps.customize.editions && Object.keys(nextProps.customize.editions).length > 0) {
        if (Object.keys(editions).length === 0) {
          this.getEditions(nextProps)
        } else if (!_.isEqual(customize.editions, nextProps.customize.editions)) {
          this.getEditions(nextProps)
        }
      }
    }
  }

  getEditions(props) {
    const allEditions: CustomizeIntf.EditionsMetadata = props.customize.editions
    if (allEditions && Object.keys(allEditions).length > 0) {
      const editions = {}
      const editionIds = Object.keys(allEditions)
      editionIds.forEach(id => {
        const edition: CustomizeIntf.EditionMetadata = allEditions[id]
        edition.lessonName = props.classroomLessons.data[edition.lesson_id] ? props.classroomLessons.data[edition.lesson_id].title : ''
        editions[id] = edition
      })
      this.setState({editions: editions})
    }
  }

  sortData(data) {
    const { sort, } = this.state
    switch (sort) {
      case 'name':
      case 'lessonName':
        return this.sortAlphabetically(data);
      case 'last_published_at':
      case 'user_id':
        return this.sortNumerically(data)
    }
  }

  sortNumerically(data) {
    const { sort, } = this.state
    return data.sort((a, b) => {
      const aSort = a[sort] ? a[sort] : 0
      const bSort = b[sort] ? b[sort] : 0
      return aSort - bSort
    })
  }

  sortAlphabetically(data) {
    const { sort, } = this.state
    return data.sort((a, b,) => {
      const aSort = a[sort] ? a[sort] : 'No Name'
      const bSort = b[sort] ? b[sort] : 'No Name'
      return aSort.localeCompare(bSort)
    })
  }

  clickSort(newSort) {
    const { sort, direction, } = this.state
    let newDirection = 'dsc';
    if (sort === newSort) {
      newDirection = direction === 'dsc' ? 'asc' : 'dsc';
    }
    this.setState({
      sort: newSort,
      direction: newDirection,
    });
  }

  classroomLesson() {
    const { classroomLessons, match, } = this.props
    return classroomLessons.data[match.params.classroomLessonID]
  }

  renderEditionTable() {
    const { editions, } = this.state
    if (Object.keys(editions).length) {
      return (
        <table className="table is-striped is-bordered">
          <thead>
            <tr>
              <th onClick={this.clickSort.bind(this, 'lessonName')}>Lesson Name</th>
              <th onClick={this.clickSort.bind(this, 'user_id')}>User ID</th>
              <th onClick={this.clickSort.bind(this, 'name')}>Edition Name</th>
              <th onClick={this.clickSort.bind(this, 'last_published_at')}>Last Published At</th>
            </tr>
          </thead>
          <tbody>
            {this.renderEditionRows()}
          </tbody>
        </table>
      )
    }
  }

  renderEditionRows() {
    const { direction, editions, } = this.state
    const data: Array<CustomizeIntf.EditionMetadata> = hashToCollection(editions)
    const sorted = this.sortData(data)
    const directed = direction === 'dsc' ? sorted.reverse() : sorted;
    return _.map(directed, e => {
      const edition:CustomizeIntf.EditionMetadata|any = e
      const link = `/lessons/#/teach/class-lessons/${edition.lesson_id}/preview/${edition.key}`
      const date = edition.last_published_at ? `${new Date(edition.last_published_at)}` : 'Not Published'
      return (
        <tr key={edition.key}>
          <td>{edition.lessonName}</td>
          <td>{edition.user_id}</td>
          <td><a href={link}>{edition.name || 'No Name'}</a></td>
          <td>{date}</td>
        </tr>
      )
    }
    );
  }

  renderMessage() {
    const { editions, } = this.state
    if (!Object.keys(editions).length) {
      return <p>No editions have been created for this lesson.</p>
    }
  }

  render() {
    const { classroomLessons, } = this.props
    if (classroomLessons.hasreceiveddata) {
      return (
        <div className="admin-classroom-lessons-container">
          <div className="lesson-header">
            <h4 className="title is-4">All Lesson Editions</h4>
          </div>
          {this.renderEditionTable()}
          {this.renderMessage()}
        </div>
      )
    } else {
      return <h1>Loading</h1>
    }
  }

}

function select(props) {
  return {
    classroomLessons: props.classroomLessons,
    classroomLessonsReviews: props.classroomLessonsReviews,
    customize: props.customize
  };
}

function mergeProps(stateProps: Object, dispatchProps: Object, ownProps: Object) {
  return {...ownProps, ...stateProps, ...dispatchProps}
}

export default connect(select, dispatch => ({dispatch}), mergeProps)(AllUserEditions);
