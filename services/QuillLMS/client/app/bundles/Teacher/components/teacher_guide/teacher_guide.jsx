import React from 'react'
import GettingStartedMini from './getting_started_mini.jsx'
import CheckboxSection from './checkbox_sections.jsx'
import _ from 'underscore'

export default class TeacherGuide extends React.Component {
  constructor(props) {
    super(props)

    const state = {
      dashboardMini: props.dashboardMini
    }

    if (props.dashboardMini) {
      state.loading = true;
      state.dashboard = true;
      state.display = false;
    } else {
      state.checkboxData = this.props.checkboxData;
    }

    this.state = state
  }

  componentDidMount() {
    if (!this.state.checkboxData) {
      $.get('/teachers/getting_started', (data) => {
        if (data) {
          this.setState({
            display: true, checkboxData: data, loading: false
          }, () => this.props.showTeacherGuide);
        }
      });
    }
  }

  groupBySectionAndCompleted() {
    const grouping = {};
    const data = this.state.checkboxData;
    data.potential.forEach((obj) => {
      const objective = obj
      // shows whether the objective has a corresponding completed checkbox
      objective.completed = _.contains(data.completed, objective.id);
      if (!grouping[objective.section]) {
        grouping[objective.section] = [objective];
      } else {
        grouping[objective.section].push(objective);
      }
    });
    return grouping;
  }

  introCopy() {
    return (
      <div className='summary intro-copy'>
        <h2>Teacher guide</h2>
        <p>Quill is very simple on the surface. Find activities and assign them to your students. But underneath, there are all kinds of power features that help you create custom activity packs, view in-depth reports, and assign activities faster. Let’s take a look!</p>
      </div>
    )
  }

  sectionPart() {
    const display = [];
    const sections = this.groupBySectionAndCompleted();
    for (const sect in sections) {
      display.push(<CheckboxSection checkboxes={sections[sect]} dashboard={false} key={sect} />);
    }
    return display;
  }

  stateSpecificComponents() {
    if (this.state.loading && this.state.dashboardMini) {
      return (<GettingStartedMini checkboxData={{ loading: true, }} />)
    } else if (this.state.dashboardMini) {
      return <GettingStartedMini checkboxData={this.groupBySectionAndCompleted()['Getting Started']} />;
    }
    return (
      <div id='teacher-guide'>
        {this.introCopy()}
        {this.sectionPart()}
      </div>
    );
  }

  render() {
    let className
    let id
    if (this.props.dashboardMini) {
      className = 'mini_container results-overview-mini-container col-md-8 col-sm-10 text-center'
      id = 'getting-started-mini'
    }
    if (this.state.display === false) {
      return <span />
    }
    return (
      <div className={className} id={id}>
        {this.stateSpecificComponents()}
      </div>
    );
  }
}
