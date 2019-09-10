import React from 'react';
import _ from 'lodash';
import { DropdownInput } from 'quill-component-library/dist/componentLibrary'

import FilterOption from './filter_option';
import FilterButton from './filter_button.jsx';
import getParameterByName from '../../../../modules/get_parameter_by_name';

export default class ActivitySearchFilter extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeFilterId: null
    }

    this.handleFilterButtonClick = this.handleFilterButtonClick.bind(this)
    this.selectFilterOption = this.selectFilterOption.bind(this)
    this.renderButton = this.renderButton.bind(this)
  }

  componentWillReceiveProps(nextProps) {
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

  handleFilterButtonClick(optionId) {
    this.selectFilterOption(optionId);
    this.setState({ activeFilterId: optionId, });
  }

  selectFilterOption(optionId) {
    this.props.selectFilterOption(this.props.data.field, optionId);
  }

  clearFilterOptionSelection() {
    this.props.selectFilterOption(this.props.data.field, null);
    this.setState({ activeFilterId: null, });
  }

  renderButton(opt) {
    return (<FilterButton
      key={`${opt.id}-activity`}
      handleFilterButtonClick={this.handleFilterButtonClick}
      data={opt}
      active={this.state.activeFilterId === opt.id}
    />);
  }

  renderAppOptions() {
    const options = _.uniqWith(this.props.data.options, _.isEqual);
    const diagnosticButtons = options.filter(opt => opt.key === 'diagnostic').map(this.renderButton)
    const wholeClassButtons = options.filter(opt => opt.key === 'lessons').map(this.renderButton)
    const independentPracticeButtons = options.filter(opt => ['connect', 'sentence', 'passage'].includes(opt.key)).map(this.renderButton)
    return (<div>
      <div className="diagnostic-section">
        <h3>Diagnostic</h3>
        <div>{diagnosticButtons}</div>
      </div>
      <div className="whole-class-section">
        <h3>Whole class instruction</h3>
        <div>{wholeClassButtons}</div>
      </div>
      <div className="independent-practice-section">
        <h3>Independent practice</h3>
        <div>{independentPracticeButtons}</div>
      </div>
    </div>)
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
      label={this.props.data.alias}
      className={this.props.data.field}
      options={options}
      value={options.find(opt => opt.value === this.state.activeFilterId)}
    />)

    // return (
    //   <div className="no-pl">
    //     <div className="button-select activity-filter-button-wrapper">
    //       <button type="button" className="select-mixin select-gray button-select button-select-wrapper" data-toggle="dropdown">
    //         {this.getFilterHeader()}
    //         <i className="fa fa-caret-down act-search-filter-fav" />
    //       </button>
    //       <ul className="dropdown-menu" role="menu">
    //         {this.getDisplayedFilterOptions()}
    //       </ul>
    //
    //     </div>
    //   </div>
    // );
  }
}
