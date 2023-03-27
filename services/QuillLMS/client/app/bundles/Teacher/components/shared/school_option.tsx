import * as React from 'react';

interface SchoolOptionProps {
  selectSchool: Function;
  school: any;
  text: string;
  secondaryText: string;
  numberOfTeachersText: string;
}

export default class SchoolOption extends React.Component<SchoolOptionProps, {}> {
  handleSchoolOptionClick = () => {
    const { selectSchool, school, } = this.props
    selectSchool(school.id, school)
  }

  render() {
    const { text, secondaryText, numberOfTeachersText, } = this.props
    return (
      <li>
        <button className="interactive-wrapper focus-on-light" onClick={this.handleSchoolOptionClick} type="button">
          <span className="text">
            <span className="primary-text">{text}</span>
            <span className="secondary-text">{secondaryText}</span>
          </span>
          <span className="metadata">{numberOfTeachersText}</span>
        </button>
      </li>
    )
  }
}
