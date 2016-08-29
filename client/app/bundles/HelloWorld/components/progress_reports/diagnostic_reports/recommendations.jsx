import React from 'react'
import $ from 'jquery'
import LoadingSpinner from '../../shared/loading_indicator.jsx'

export default React.createClass({

  getInitialState: function () {
    return {
      loading: true,
      recommendations: [],
      students: []
    }
  },

  componentDidMount: function () {
    let that = this;
    $.get('/teachers/progress_reports/recommendations_for_classroom/' + that.props.params.classroomId, (data) => {
      console.log(data);
      that.setState({recommendations: data.recommendations, students: data.students, loading: false})
    })
  },

  renderExplanation: function () {
    return (
      <div className='recommendations-explanation-container'>
        <p className="recommendations-explanation">
          Based on the results of the diagnostic, we created a personalized learning plan for each student.
          <br/>Customize your learning plan by selecting the activity packs you would like to assign.
        </p>
      </div>
    )
  },

  renderTopBar: function () {
    return (
      <div className="recommendations-top-bar">
        <div className="recommendations-key">
          <div className="recommendations-key-icon">

          </div>
          <p>Recommended Activity Packs</p>
        </div>
        <div className="recommendations-assign-button" onClick={() => alert("Assigning") }>
          <span>Assign Activity Packs</span>
        </div>
      </div>
    )
  },

  renderTableHeader: function () {
    return (
      <div className="recommendations-table-header">
        <div className="recommendations-table-header-name">Name</div>
        {this.renderActivityPackHeaderItems()}
      </div>
    )
  },

  renderActivityPackHeaderItems: function () {
    return this.state.recommendations.map((recommendation) => {
      return (
        <div className="recommendations-table-header-item">{recommendation.name}</div>
      )
    })
  },

  renderTableRows: function () {
    return this.state.students.map((student) => {
      return this.renderTableRow(student)
    })
  },

  renderTableRow: function (student) {
    return (
      <div className="recommendations-table-row">
        <div className="recommendations-table-row-name">{student.name}</div>
        {this.renderActivityPackRowItems(student)}
      </div>
    )
  },

  renderActivityPackRowItems: function (student) {
    return this.state.recommendations.map((recommendation) => {
      return (
        <div className="recommendations-table-row-item">
          <div className="recommendations-table-row-item-checkbox">

          </div>
          <p>{recommendation.name}</p>
        </div>
      )
    })
  },

  render: function () {
    if (this.state.loading) {
			return <LoadingSpinner/>
		} else {
      return (
        <div>
          {this.renderExplanation()}

          <div className="recommendations-container">
            {this.renderTopBar()}
            {this.renderTableHeader()}
            {this.renderTableRows()}
          </div>
        </div>
      )
		}

  }

})
