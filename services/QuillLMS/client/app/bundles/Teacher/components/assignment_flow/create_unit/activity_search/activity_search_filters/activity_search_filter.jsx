import React from 'react';
import _ from 'lodash';

import FilterButton from './filter_button.jsx';

import getParameterByName from '../../../../modules/get_parameter_by_name';
import { DropdownInput } from '../../../../../../Shared/index'

export default class ActivitySearchFilter extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeFilterId: null
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!nextProps.activeFilterOn) {
      this.setState({ activeFilterId: null, });
    } else if (nextProps.data.field === 'activity_classification' && nextProps.data.options.length > 0) {
      const toolName = getParameterByName('tool');
      if (toolName) {
        const optionId = nextProps.data.options.find(option => option.key === toolName).id;
         // this should only be the case on initial render
        if (this.state.activeFilterId === null && nextProps.data.selected === null) {
          this.handleFilterButtonClick(optionId);
        }
      }
    }
  }

  getDisplayedFilterOptions() {
    // unique options
    const options = _.uniqWith(this.props.data.options, _.isEqual);
    options.sort((a, b) => {
      const textA = a.name.toUpperCase();
      const textB = b.name.toUpperCase();
      return textA.localeCompare(textB, 'en', { numeric: true, })
    });
    // ensure that the show all option is always on the top
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      if (option.id === this.props.showAllId) {
        options.splice(i, 1);
        options.unshift(option);
      }
    }

    return options.map((opt) => {
      return { value: opt.id, label: opt.name, }
    })
  }

  getFilterHeader() {
    if (this.props.data.selected) {
      return this.getSelectedOption().name;
    }
    return this.props.data.alias;
  }

  getSelectedOption() {
    return _.find(this.props.data.options, { id: this.props.data.selected, }, this);
  }

  clearFilterOptionSelection() {
    this.props.selectFilterOption(this.props.data.field, null);
    this.setState({ activeFilterId: null, });
  }

  handleFilterButtonClick = optionId => {
    this.props.selectFilterOption(this.props.data.field, optionId);
    this.setState({ activeFilterId: optionId, });
  };

  renderAppOptions() {
    const options = _.uniqWith(this.props.data.options, _.isEqual);
    const diagnosticButtons = options.filter(opt => opt.key === 'diagnostic').map(this.renderButton)
    const wholeClassButtons = options.filter(opt => opt.key === 'lessons').map(this.renderButton)
    const independentPracticeButtons = options.filter(opt => ['connect', 'sentence', 'passage'].includes(opt.key)).map(this.renderButton)
    return (<div className="app-button-container">
      <div className="diagnostic-section activity-type-section">
        <h3>Diagnostic</h3>
        <div className="app-buttons">{diagnosticButtons}</div>
      </div>
      <div className="whole-class-section activity-type-section">
        <h3>Whole class instruction</h3>
        <div className="app-buttons">{wholeClassButtons}</div>
      </div>
      <div className="independent-practice-section activity-type-section">
        <h3>Independent practice</h3>
        <div className="app-buttons">{independentPracticeButtons}</div>
      </div>
    </div>)
  }

  renderButton = opt => {
    return (<FilterButton
      active={this.state.activeFilterId === opt.id}
      data={opt}
      handleFilterButtonClick={this.handleFilterButtonClick}
      key={`${opt.id}-activity`}
    />);
  };

  render() {
		// Nothing is selected. 'Filter by X' displays. All other options can be selected.
		// An option is selected. Option name displays. Options now include 'All X'.
    const filterIsButtons = this.props.data.field === 'activity_classification';
    if (filterIsButtons) {
      return (
        <div className="activity-filter button-row">
          {this.renderAppOptions()}
        </div>
      );
    }

    const options = this.getDisplayedFilterOptions()
    return (<DropdownInput
      className={this.props.data.field}
      handleChange={(opt) => this.handleFilterButtonClick(opt.value)}
      id="custom-activity-pack-dropdown"
      label={this.props.data.alias}
      options={options}
      value={options.find(opt => opt.value === this.state.activeFilterId)}
    />)
  }
}
