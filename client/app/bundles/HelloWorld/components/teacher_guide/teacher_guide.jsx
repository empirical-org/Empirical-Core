'use strict'
import React from 'react'
import GettingStartedMini from './getting_started_mini.jsx'
import CheckboxSection from './checkbox_sections.jsx'
import _ from 'underscore'

export default React.createClass({
    propTypes: {
        dashboardMini: React.PropTypes.bool.isRequired,
        hideTeacherGuide: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        var state = {
            dashboardMini: this.props.dashboardMini
        };
        if (this.props.dashboardMini) {
            state.loading = true;
            state.dashboard = true;
            state.className = "mini_container results-overview-mini-container col-md-8 col-sm-10 text-center";
            state.id = "getting-started-mini";
        } else {
            state.checkboxData = this.props.checkboxData;
        }
        return state;
    },

    componentDidMount: function() {
        this.getInitialState();
        var that = this;
        if (!this.state.checkboxData) {
            $.get('/teachers/getting_started', function(data) {
                data === false
                    ? that.props.hideTeacherGuide()
                    : that.setState({checkboxData: data, loading: false});
            });
        }

    },

    groupBySectionAndCompleted: function() {
        var grouping = {};
        var data = this.state.checkboxData;
        data.potential.forEach(function(objective) {
            // shows whether the objective has a corresponding completed checkbox
            objective.completed = _.contains(data.completed, objective.id);
            if (!grouping[objective.section]) {
                grouping[objective.section] = [objective];
            } else {
                grouping[objective.section].push(objective);
            }
        });
        return grouping;
    },

    sectionPart: function() {
        var display = [];
        var sections = this.groupBySectionAndCompleted();
        for (var sect in sections) {
            display.push(<CheckboxSection checkboxes={sections[sect]} dashboard={false}/>);
        }
        return display;
    },

    introCopy: function() {
        return (
            <div className='summary intro-copy'>
                <h2>Complete these quests and become a Quill guru!</h2>
                <p>Quill is very simple on the surface. Find activities and assign them to your students. But underneath, there all kinds of power features that help you create custom activity packs, view in-depth reports and assign activities faster. Let’s take a look!</p>
            </div>
        )
    },

    stateSpecificComponents: function() {
        if (this.state.loading && this.state.dashboardMini) {
            return <GettingStartedMini checkboxData={{
                loading: true
            }}/>
        } else if (this.state.dashboardMini) {
            return <GettingStartedMini checkboxData={this.groupBySectionAndCompleted()["Getting Started"]}/>;
        } else {
            return (
                <div id='teacher-guide'>
                    {this.introCopy()}
                    {this.sectionPart()}
                </div>
            );
        }
    },

    render: function() {
        return (
            <div className={this.state.className} id={this.state.id}>
                {this.stateSpecificComponents()}
            </div>
        );
    }

});
